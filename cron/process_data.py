import math
import json
import requests

############################################################
# Fetch json data
############################################################

def fetch_json(url, output_filepath):
    response = requests.get(url)
    with open(filepath, "w") as write_file:
        write_file.write(response.text)

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

############################################################
# Encode json data
############################################################

def write_to_json(path, data):
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
        for v in data['result']:
            values.append({'x': v[0], 'y': v[1]})
        f.seek(0)
        json.dump({'values': values }, f, indent=4)
        f.truncate()

def normalize_data(input_filepath, output_filepath, func):
    """
    Plug all values (excluding x) into a given function.
    """
    data = read_from_json(input_filepath)
    for v in data['values']: 
        for key in v:
            if key != 'x': v[key] = func(v[key])
    write_to_json(output_filepath, data)

def get_m2(n_path, s_path, output_filepath, func):
    m2_values = []
    n_data = read_from_json(n_path)
    s_data = read_from_json(s_path)

    for i, n in enumerate(n_data['values']): 
        y = func(n['y'], s_data['values'][i]['y'])
        m2_values.append({'x': n['x'], 'y': y})

    write_to_json(output_filepath, {'values': m2_values})

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
