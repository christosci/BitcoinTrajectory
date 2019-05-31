from pytrends.request import TrendReq
from process_data import write_to_json
from constants import INTEREST
from datetime import datetime

pytrends = TrendReq(hl='en-US')
kw_list = ["bitcoin"]
tf = '2013-01-01 ' + datetime.today().strftime('%Y-%m-%d')
pytrends.build_payload(kw_list, cat=0, timeframe=tf, geo='', gprop='')
df = pytrends.interest_over_time()

data = []
for date, row in df.iterrows():
    y = row['bitcoin']
    x = date.timestamp()
    data.append({'x': x, 'y': y})

write_to_json(INTEREST, {'values': data})
