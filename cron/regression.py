import numpy as np
from scipy.optimize import curve_fit
import json

def power(fx, a, b):
    return a*(fx)**b

def get_r2(f, x, y, popt):
    ss_res = np.dot((y - f(x, *popt)),(y - f(x, *popt)))
    ymean = np.mean(y)
    ss_tot = np.dot((y-ymean),(y-ymean))
    return 1-ss_res/ss_tot

def do_curve_fit(f, x, y):
    popt, pcov = curve_fit(power, x, y)
    r2 = get_r2(power, x, y, popt)
    return popt, r2

def json_to_xy(filepath, x_start, x_stop):
    """
    Parses JSON xy values from blockchain.com charts API.
    :returns: raw y values as y[] and their indices as x[].
    """
    y = []
    with open(filepath) as json_data:
        data = json.load(json_data)
    for v in data['values']:
        if (x_start <= v['x'] <= x_stop):
            y.append(v['y'])
    x = range(len(y))
    return x, y

def xy_to_json(filepath, r2, popt, values):
    """
    Writes r2 and xy values of regression line to JSON file.
    """
    regression_data = {'r2': r2, 'popt': popt, 'values': values}
    with open(filepath, 'w') as write_file:
        json.dump(regression_data, write_file, indent=2)

def regression_to_xy_dict(f, popt, x_start, x_stop, x_step):
    """
    :returns: dict of xy values based on given regression parameters.
    """
    values = []
    for fx, x in enumerate(range(x_start, x_stop, x_step)):
        y = int(f(fx, popt[0], popt[1]))
        values.append({'x': x, 'y': y})
    return values