from os import path
import calendar
import time

START_TIMESTAMP = 1279324800
START_DATE = '2010-07-16'
END_TIMESTAMP = 1519603200
REGRESSION_X_STEP = 30 # days
REGRESSION_TIMESPAN = 631139040 # 20 years
CURRENT_TIME = int(calendar.timegm(time.gmtime()))

DATA_PATH = path.abspath(path.join(path.dirname(__file__), '..', 'data'))
DATA_MIN_PATH = path.abspath(path.join(path.dirname(__file__), '..', 'data-min'))

STATIC_PATH = path.join(DATA_PATH, 'static')
REGRESSIONS_PATH = path.join(DATA_PATH, 'regressions')
REGRESSIONS_MIN_PATH = path.abspath(path.join(DATA_MIN_PATH, 'regressions'))
NORMALIZED_PATH = path.join(DATA_PATH, 'normalized')
NORMALIZED_MIN_PATH = path.join(DATA_MIN_PATH, 'normalized')

# static data
HALVINGS = path.join(STATIC_PATH, 'halvings.json')
BLKHDRS_RAW = path.join(STATIC_PATH, 'blkhdrs')
BLKHDRS = path.join(STATIC_PATH, 'blockchain_headers.csv')

# raw data
ADDRESSES = path.join(DATA_PATH, 'addresses.json')
MARKETCAP = path.join(DATA_PATH, 'marketcap.json')
PRICE = path.join(DATA_PATH, 'price.json')
REALIZEDCAP = path.join(DATA_PATH, 'realizedcap.json')
SUPPLY = path.join(DATA_PATH, 'supply.json')
TRANSACTIONS = path.join(DATA_PATH, 'transactions.json')
MONTHLY_SUPPLY = path.join(DATA_PATH, 'monthly_supply.json')
INTEREST = path.join(DATA_PATH, 'interest.json')

# regression data
TRANSACTIONS_POWER_SQUARED = path.join(REGRESSIONS_PATH, 'transactions_power_squared.json')
ADDRESSES_POWER_GENMETCALFE = path.join(REGRESSIONS_PATH, 'addresses_power_genmetcalfe.json')
TROLOLOLO_LOG = path.join(REGRESSIONS_PATH, 'trolololo_log.json')
POWER_LAW = path.join(REGRESSIONS_PATH, 'power_law.json')

# normalized data
TRANSACTIONS_SQUARED = path.join(NORMALIZED_PATH, 'transactions_squared.json')
ADDRESSES_GENMETCALFE = path.join(NORMALIZED_PATH, 'addresses_genmetcalfe.json')
TRANSACTIONS_M2 = path.join(NORMALIZED_PATH, 'transactions_m2.json')
STOCK_TO_FLOW = path.join(NORMALIZED_PATH, 'stock_flow.json')
INTEREST_SCALED = path.join(NORMALIZED_PATH, 'interest_scaled.json')
DAILY_LOG_RETURNS = path.join(NORMALIZED_PATH, 'daily_log_returns.json')

# API URLs
BLOCKCHAIN_URL = 'https://api.blockchain.info/charts/'
COINMETRICS_URL = 'https://community-api.coinmetrics.io/v2/assets/btc/'

DATA_INFO = [
    {
        'path': ADDRESSES,
        'url': COINMETRICS_URL,
        'endpoint': 'metricdata?metrics=AdrActCnt&start=%s' % START_DATE
    },
    {
        'path': MARKETCAP,
        'url': BLOCKCHAIN_URL,
        'endpoint': 'market-cap?timespan=all&start=%s&format=json&sampled=false' % START_TIMESTAMP
    },
    {
        'path': PRICE,
        'url': BLOCKCHAIN_URL,
        'endpoint': 'market-price?timespan=all&start=%s&format=json&sampled=false' % START_TIMESTAMP
    },
    {
        'path': REALIZEDCAP,
        'url': COINMETRICS_URL,
        'endpoint': 'metricdata?metrics=CapRealUSD&start=%s' % START_DATE
    },
    {
        'path': SUPPLY,
        'url': BLOCKCHAIN_URL,
        'endpoint': 'total-bitcoins?timespan=all&start=%s&format=json&sampled=false' % START_TIMESTAMP
    },
    {   
        'path': TRANSACTIONS,
        'url': BLOCKCHAIN_URL,
        'endpoint': 'n-transactions-excluding-popular?timespan=all&start=%s&format=json&sampled=false' % START_TIMESTAMP
    }
]
