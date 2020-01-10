from os import path
import calendar
import time

QUANDL_API_KEY = '6Vypbvq4CTqLv-USiz-y'
START_TIMESTAMP = 1279324800
START_DATE = '2010-07-18'
END_TIMESTAMP = 1519603200
REGRESSION_X_STEP = 30 # days
REGRESSION_TIMESPAN = 361670400 
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
FEAR_GREED = path.join(DATA_PATH, 'fear_greed.json')
VOLUME = path.join(DATA_PATH, 'volume.json')
COT = path.join(DATA_PATH, 'cot.json')
DEALER_RATIO = path.join(DATA_PATH, 'dealer_ratio.json')
ASSETMNGR_RATIO = path.join(DATA_PATH, 'assetmngr_ratio.json')
FUNDS_RATIO = path.join(DATA_PATH, 'funds_ratio.json')

# regression data
TRANSACTIONS_POWER_SQUARED = path.join(REGRESSIONS_PATH, 'transactions_power_squared.json')
ADDRESSES_POWER_GENMETCALFE = path.join(REGRESSIONS_PATH, 'addresses_power_genmetcalfe.json')
TROLOLOLO_LOG = path.join(REGRESSIONS_PATH, 'trolololo_log.json')
POWER_LAW = path.join(REGRESSIONS_PATH, 'power_law.json')

# normalized data
TRANSACTIONS_SQUARED = path.join(NORMALIZED_PATH, 'transactions_squared.json')
METCALFE_PRICE = path.join(NORMALIZED_PATH, 'metcalfe_price.json')
ADDRESSES_GENMETCALFE = path.join(NORMALIZED_PATH, 'addresses_genmetcalfe.json')
STOCK_TO_FLOW = path.join(NORMALIZED_PATH, 'stock_flow.json')
INTEREST_SCALED = path.join(NORMALIZED_PATH, 'interest_scaled.json')
DAILY_LOG_RETURNS = path.join(NORMALIZED_PATH, 'daily_log_returns.json')
METCALFE_MULTIPLE = path.join(NORMALIZED_PATH, 'metcalfe_multiple.json')

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
        'url': COINMETRICS_URL,
        'endpoint': 'metricdata?metrics=CapMrktCurUSD&start=%s' % START_DATE
    },
    {
        'path': PRICE,
        'url': COINMETRICS_URL,
        'endpoint': 'metricdata?metrics=PriceUSD&start=%s' % START_DATE
    },
    {
        'path': REALIZEDCAP,
        'url': COINMETRICS_URL,
        'endpoint': 'metricdata?metrics=CapRealUSD&start=%s' % START_DATE
    },
    {
        'path': SUPPLY,
        'url': COINMETRICS_URL,
        'endpoint': 'metricdata?metrics=SplyCur&start=%s' % START_DATE
    },
    {   
        'path': TRANSACTIONS,
        'url': BLOCKCHAIN_URL,
        'endpoint': 'n-transactions-excluding-popular?timespan=all&start=%s&format=json&sampled=false' % START_TIMESTAMP
    },
    {
        'path': VOLUME,
        'url': BLOCKCHAIN_URL,
        'endpoint': 'trade-volume?timespan=all&start=%s&format=json&sampled=false' % START_TIMESTAMP
    },
    {
        'path': FEAR_GREED,
        'url': 'https://api.alternative.me/',
        'endpoint': 'fng/?limit=0'
    },
    {
        'path': COT,
        'url': 'https://www.quandl.com/api/v3/datasets/',
        'endpoint': 'CFTC/133741_F_ALL.json?api_key=%s' % QUANDL_API_KEY
    }
]
