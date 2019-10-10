import os
import math
import json
import requests
from constants import *
import logging
import dateutil.parser

logging.basicConfig(filename='error.log', level=logging.INFO)

############################################################
# Fetch json data
############################################################

def fetch_json():
    for info in DATA_INFO:
        full_url = info['url'] + info['endpoint']
        r = requests.get(full_url)
        if not (r.status_code == 404 or 'error' in json.loads(r.text)):
            with open(info['path'], "w") as write_file:
                write_file.write(r.text)
        else:
            logging.info('Could not fetch json response from ' + full_url)

############################################################
# Decode json data
############################################################

def read_from_json(path):
    with open(path) as json_data:
        return json.load(json_data)

def json_to_xy(filepath, x_start, x_stop):
    """
    :returns: raw y values as y[] and their indices as x[].
    """
    data = read_from_json(filepath)
    y = []
    for v in data['values']:
        if (x_start <= v['x'] <= x_stop):
            y.append(v['y'])
    x = range(len(y))
    return x, y

def json_to_x(filepath, x_start = 0, x_stop = math.inf):
    """
    :returns: raw x values as x[].
    """
    data = read_from_json(filepath)
    x = []
    for v in data['values']:
        if (x_start <= v['x'] <= x_stop):
            x.append(v['x'])
    return x

def get_max_y(filepath):
    """
    Returns maximum y value.
    """
    data = read_from_json(filepath)
    max = data['values'][0]['y']
    for v in data['values']:
        if v['y'] > max:
            max = v['y']
    return max

def get_min_y(filepath):
    """
    Returns minimum y value.
    """
    data = read_from_json(filepath)
    min = data['values'][0]['y']
    for v in data['values']:
        if v['y'] < min:
            min = v['y']
    return min

############################################################
# Encode json data
############################################################

def write_to_json(path, data):
    basename = os.path.basename(path)
    data['short_name'] = os.path.splitext(basename)[0]
    with open(path, 'w') as write_file:
        json.dump(data, write_file, indent=4)

def xy_to_json(filepath, coeffs, values):
    regression_data = {'coeffs': coeffs, 'values': values}
    write_to_json(filepath, regression_data)

def regression_to_xy_dict(x_start, x_stop, days_to_skip, func, coeffs, cl=None,):
    """
    :returns: dict of xy values based on given regression parameters.
    """
    day = 86400
    x_step = day * days_to_skip
    values = []
    for i, x in enumerate(range(x_start, x_stop, x_step)):
        fx = i*days_to_skip
        y = func(fx, *coeffs)
        if cl is not None:
            bound_upper = func(fx, *(coeffs + cl))
            bound_lower = func(fx, *(coeffs - cl))
            if 0 not in (bound_upper, bound_lower):
                values.append({'x': x, 'y': y, 'y_upper': bound_upper, 'y_lower': bound_lower})
        else:
            if y != 0:
                values.append({'x': x, 'y': y})
    return values

############################################################
# Manipulate json data
############################################################

def format_coinmetrics_data(filepath):
    """
    Formats JSON data from coinmetrics.io API.
    """
    with open(filepath, 'r+') as f:
        data = json.load(f)
        values = []
        for v in data['metricData']['series']:
            time = dateutil.parser.parse(v['time']).timestamp()
            values.append({'x': time, 'y': float(v['values'][0])})
        f.seek(0)
        json.dump({'values': values }, f, indent=4)
        f.truncate()

def apply(input_filepath, output_filepath, func, *args):
    """
    Plug all values (excluding x) into a given function.
    """
    data = read_from_json(input_filepath)
    for v in data['values']: 
        for key in v:
            if key != 'x': v[key] = func(v[key], *args)
    write_to_json(output_filepath, data)

def create_log_returns(input_filepath, output_filepath, func):
    data = read_from_json(input_filepath)
    prev = 1
    for v in data['values']:
        temp = v['y']
        v['y'] = func(v['y'], prev)
        prev = temp
    write_to_json(output_filepath, data)

def create_stock_to_flow(supply_path, output_filepath, func, start_month = 9):
    supply = read_from_json(supply_path)
    output = []

    for i, v in enumerate(supply['values']):
        if (i < start_month): continue
        prev_v = supply['values'][i-1]
        y = func(v['y'], prev_v['y'])
        output.append({'x': v['x'], 'y': y})
        
    write_to_json(output_filepath, {'values': output})

def remove_zero_values(filepath):
    """
    Remove all zero y values from data.
    """
    with open(filepath, 'r+') as f:
        data = json.load(f)
        values = []
        for v in data['values']:
            if v['y'] != 0 and v['y'] is not None:
                values.append({'x': v['x'], 'y': v['y']})
        f.seek(0)
        json.dump({'values': values}, f, indent=4)
        f.truncate()
