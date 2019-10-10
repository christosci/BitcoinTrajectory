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
    for info in DATA_INFO:
        remove_zero_values(info['path'])

def normalize():
    """
    Normalize data - needs to be done in a routine basis after fetching data.
    """
    apply(TRANSACTIONS, TRANSACTIONS_SQUARED, square)
    apply(ADDRESSES, ADDRESSES_GENMETCALFE, generalized_metcalfe)
    create_stock_to_flow(MONTHLY_SUPPLY, STOCK_TO_FLOW, stock_to_flow)
    apply(INTEREST, INTEREST_SCALED, scale, get_max_y(PRICE)/100)
    create_log_returns(PRICE, DAILY_LOG_RETURNS, log_return)
    apply2(TRANSACTIONS_SQUARED, SUPPLY, METCALFE_PRICE, np.divide)
    apply2(PRICE, METCALFE_PRICE, METCALFE_MULTIPLE, np.divide)
    
def regress():
    """
    Perform regression analysis over data.
    """
    # metcalfe's law
    create_regression(TRANSACTIONS, TRANSACTIONS_POWER_SQUARED, power)
    apply(TRANSACTIONS_POWER_SQUARED, TRANSACTIONS_POWER_SQUARED, square)
    
    # generalized metcalfe's law
    create_regression(ADDRESSES, ADDRESSES_POWER_GENMETCALFE, power)
    apply(ADDRESSES_POWER_GENMETCALFE, ADDRESSES_POWER_GENMETCALFE, generalized_metcalfe)

def plot():
    """
    Plot functions with given constants and coefficients.
    """
    # Trolololo's logarithmic regression
    plot_function(TROLOLOLO_LOG, 1231459200, log, np.asarray([2.66167155005961, 17.9183761889864]))
    # Power law
    plot_function(POWER_LAW, 1230940800, power, np.asarray([3.4896e-18, 5.9762], dtype=np.float))    


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        if arg == 'fetch': fetch()
        elif arg == 'normalize': normalize()
        elif arg == 'regress': regress()
        elif arg == 'plot': plot()
        elif arg == 'minify': minify()
