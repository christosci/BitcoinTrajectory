from os import path
import regression as r
import json

start_timestamp = 1279324800
end_timestamp = 1519603200

#  https://api.blockchain.info/charts/n-transactions-excluding-popular?timespan=all&start=1279324800&format=json&sampled=false

def create_regression(input_filepath, output_filepath, f):
    x, y = r.json_to_xy(input_filepath, start_timestamp, end_timestamp)
    x_stop = start_timestamp + 631139040 # 20 years
    x_step = 86400 # 1 day
    popt, r2 = r.do_curve_fit(f, x, y)
    print(popt)
    print(r2)
    values = r.regression_to_xy_dict(f, popt, start_timestamp, x_stop, x_step)
    r.xy_to_json(output_filepath, r2, popt.tolist(), values)

def main():
    data_basepath = path.abspath(path.join(path.dirname(__file__), '..', 'data'))
    regressions_path = path.join(data_basepath, 'regressions')

    transactions_in = path.join(data_basepath, 'transactions.json')
    addresses_in = path.join(data_basepath, 'addresses.json')
    transactions_power_out = path.join(regressions_path, 'transactions_power.json')
    addresses_power_out = path.join(regressions_path, 'addresses_power.json')

    create_regression(transactions_in, transactions_power_out, r.power)
    create_regression(addresses_in, addresses_power_out, r.power)

if __name__ == "__main__":
    main()