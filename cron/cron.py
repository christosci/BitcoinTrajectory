import sys
import json
import numpy as np
from constants import *
from calculate import *
from process_data import *
from minify_data import minify


def fetch():
    """
    Fetch data and format it.
    """
    fetch_json() # fetch json files
    # format everything
    format_coinmetrics_data(ADDRESSES)
    format_coinmetrics_data(REALIZEDCAP)
    format_coinmetrics_data(PRICE)
    format_coinmetrics_data(MARKETCAP)
    format_coinmetrics_data(SUPPLY)
    format_fear_greed(FEAR_GREED)
    for info in DATA_INFO:
        remove_zero_values(info['path'])

def normalize():
    """
    Normalize data - needs to be done in a routine basis after fetching data.
    """
    apply(
        input_filepath = TRANSACTIONS, 
        output_filepath = TRANSACTIONS_SQUARED, 
        func = square
    )
    apply(
        input_filepath = ADDRESSES, 
        output_filepath = ADDRESSES_GENMETCALFE, 
        func = generalized_metcalfe
    )
    create_stock_to_flow(
        supply_path = MONTHLY_SUPPLY, 
        output_filepath = STOCK_TO_FLOW, 
        func = stock_to_flow
    )
    apply(
        INTEREST, 
        INTEREST_SCALED, 
        scale, 
        get_max_y(PRICE)/100
    )
    create_log_returns(
        input_filepath = PRICE, 
        output_filepath = DAILY_LOG_RETURNS,
        func = log_return
    )
    apply2(
        a_path = TRANSACTIONS_SQUARED, 
        b_path = SUPPLY, 
        output_filepath = METCALFE_PRICE, 
        func = np.divide
    )
    apply2(
        a_path = PRICE, 
        b_path = METCALFE_PRICE,
        output_filepath = METCALFE_MULTIPLE,
        func = np.divide
    )
    
def regress():
    """
    Perform regression analysis over data.
    """
    # metcalfe's law
    create_regression(
        input_filepath = TRANSACTIONS, 
        output_filepath = TRANSACTIONS_POWER_SQUARED,
        x_stop = START_TIMESTAMP + REGRESSION_TIMESPAN,
        func = power
    )
    apply(
        input_filepath = TRANSACTIONS_POWER_SQUARED,
        output_filepath = TRANSACTIONS_POWER_SQUARED,
        func = square
    )
    
    # generalized metcalfe's law
    create_regression(
        input_filepath = ADDRESSES, 
        output_filepath = ADDRESSES_POWER_GENMETCALFE,
        x_stop = START_TIMESTAMP + REGRESSION_TIMESPAN,
        func = power
    )
    apply(
        input_filepath = ADDRESSES_POWER_GENMETCALFE, 
        output_filepath = ADDRESSES_POWER_GENMETCALFE,
        func = generalized_metcalfe
    )

def plot():
    """
    Plot functions with given constants and coefficients.
    """
    # Trolololo's logarithmic regression
    plot_function(
        output_filepath = TROLOLOLO_LOG, 
        x_start = 1231459200,
        x_stop = 1798761600,
        func = log, 
        coeffs = np.asarray([2.66167155005961, 17.9183761889864])
    )

    # Power law
    plot_function(
        output_filepath = POWER_LAW, 
        x_start = 1230940800, 
        x_stop = 1910463840,
        func = power,
        coeffs = np.asarray([3.4896e-18, 5.9762], dtype=np.float)
    )

def r2():
    trolololo = get_r2(
        x_start = 1231459200,
        true = read_from_json(PRICE)['values'],
        func = log,
        coeffs = np.asarray([2.66167155005961, 17.9183761889864])
    )

    add_element(TROLOLOLO_LOG, {'r2': trolololo})

    power_law = get_r2(
        x_start = 1230940800,
        true = read_from_json(PRICE)['values'],
        func = power,
        coeffs = np.asarray([3.4896e-18, 5.9762], dtype=np.float)
    )

    add_element(POWER_LAW, {'r2': power_law})


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        if arg == 'fetch': fetch()
        elif arg == 'normalize': normalize()
        elif arg == 'regress': regress()
        elif arg == 'plot': plot()
        elif arg == 'minify': minify()
        elif arg == 'r2': r2()
