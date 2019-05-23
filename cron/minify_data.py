import json
from os import path
import os
from constants import *
from process_data import read_from_json, write_to_json

def minify_data(filepath, min_path, values_to_skip = 7):
    new_values = []
    data = read_from_json(filepath)
    for i in range(0, len(data['values']), values_to_skip):
        new_values.append(data['values'][i])
    data['values'] = new_values
    write_to_json(path.join(min_path, path.basename(filepath)), data)

def minify_regressions(filepath):
    new_values = []
    data = read_from_json(filepath)
    new_values = [v for v in data['values'] if START_TIMESTAMP < v['x'] < CURRENT_TIME]
    data['values'] = new_values
    write_to_json(path.join(REGRESSIONS_MIN_PATH, path.basename(filepath)), data)

def minify():
    for f in os.listdir(DATA_PATH):
        if f.endswith(".json"): 
            filepath = path.join(DATA_PATH, f)
            minify_data(filepath, DATA_MIN_PATH)

    for f in os.listdir(NORMALIZED_PATH):
        if f.endswith(".json"): 
            filepath = path.join(NORMALIZED_PATH, f)
            minify_data(filepath, NORMALIZED_MIN_PATH)

    for f in os.listdir(REGRESSIONS_PATH):
        if f.endswith(".json"): 
            filepath = path.join(REGRESSIONS_PATH, f)
            minify_regressions(filepath)