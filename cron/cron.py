import json
from constants import *
from calculate import *
from process_data import *

def main():
    # fetch data and format it
    fetch_json()
    format_coinmetrics_data(ADDRESSES)
    format_coinmetrics_data(REALIZEDCAP)
    for info in DATA_INFO:
        remove_zero_values(info['path'])

    # normalize data
    normalize_data(TRANSACTIONS, TRANSACTIONS_SQUARED, square)
    normalize_data(ADDRESSES, ADDRESSES_GENMETCALFE, generalized_metcalfe)
    # m2
    get_m2(TRANSACTIONS, SUPPLY, TRANSACTIONS_M2, m2)

    import minify_data
    
    # transactions squared
    # create_regression(TRANSACTIONS, TRANSACTIONS_POWER_SQUARED, power)
    # normalize_data(TRANSACTIONS_POWER_SQUARED, TRANSACTIONS_POWER_SQUARED, square)

    # addresses generalized metcalfe
    # create_regression(ADDRESSES, ADDRESSES_POWER_GENMETCALFE, power)
    # normalize_data(ADDRESSES_POWER_GENMETCALFE, ADDRESSES_POWER_GENMETCALFE, generalized_metcalfe)

    # Trolololo
    # plot_function(TROLOLOLO_LOG, 1231459200, log, np.asarray([2.66167155005961, 17.9183761889864]))

    # Power law
    # plot_function(POWER_LAW, 1230940800, power, np.asarray([3.4896e-18, 5.9762]))


if __name__ == "__main__":
    main()