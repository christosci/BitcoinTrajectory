from os import path

START_TIMESTAMP = 1279324800
END_TIMESTAMP = 1519603200
REGRESSION_X_STEP = 30 # days
REGRESSION_TIMESPAN = 631139040 # 20 years

DATA_PATH = path.abspath(path.join(path.dirname(__file__), '..', 'data'))
DATA_MIN_PATH = path.abspath(path.join(path.dirname(__file__), '..', 'data-min'))

REGRESSIONS_PATH = path.join(DATA_PATH, 'regressions')
REGRESSIONS_MIN_PATH = path.abspath(path.join(DATA_MIN_PATH, 'regressions'))
NORMALIZED_PATH = path.join(DATA_PATH, 'normalized')
NORMALIZED_MIN_PATH = path.join(DATA_MIN_PATH, 'normalized')

# raw data
TRANSACTIONS = path.join(DATA_PATH, 'transactions.json')
ADDRESSES = path.join(DATA_PATH, 'addresses.json')
ADDRESSES = path.join(DATA_PATH, 'addresses.json')
SUPPLY = path.join(DATA_PATH, 'supply.json')
REALIZEDCAP = path.join(DATA_PATH, 'realizedcap.json')

# regression data
TRANSACTIONS_POWER_SQUARED = path.join(REGRESSIONS_PATH, 'transactions_power_squared.json')
ADDRESSES_POWER_GENMETCALFE = path.join(REGRESSIONS_PATH, 'addresses_power_genmetcalfe.json')
TROLOLOLO_LOG = path.join(REGRESSIONS_PATH, 'trolololo_log.json')

# normalized data
TRANSACTIONS_SQUARED = path.join(NORMALIZED_PATH, 'transactions_squared.json')
ADDRESSES_GENMETCALFE = path.join(NORMALIZED_PATH, 'addresses_genmetcalfe.json')
TRANSACTIONS_M2 = path.join(NORMALIZED_PATH, 'transactions_m2.json')