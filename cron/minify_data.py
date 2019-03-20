import json
from os import path
import os
from constants import *
from process_data import read_from_json, write_to_json

def minify_data(values_to_skip):
    for f in data_filenames:
        new_values = []
        data = read_from_json(path.join(DATA_PATH, f))
        for i in range(0, len(data['values']), values_to_skip):
            new_values.append(data['values'][i])
        data['values'] = new_values
        write_to_json(path.join(DATA_MIN_PATH, f), data)

def minify_normalized_data(values_to_skip):
    for f in normalized_filenames:
        new_values = []
        data = read_from_json(path.join(NORMALIZED_PATH, f))
        for i in range(0, len(data['values']), values_to_skip):
            new_values.append(data['values'][i])
        data['values'] = new_values
        write_to_json(path.join(NORMALIZED_MIN_PATH, f), data)

def minify_regressions():
    for f in regression_filenames:
        new_values = []
        data = read_from_json(path.join(REGRESSIONS_PATH, f))
        new_values = [v for v in data['values'] if START_TIMESTAMP < v['x'] < CURRENT_TIME]
        data['values'] = new_values
        write_to_json(path.join(REGRESSIONS_MIN_PATH, f), data)


data_filenames = []
normalized_filenames = []
regression_filenames = []

for f in os.listdir(DATA_PATH):
    if f.endswith(".json"): 
            data_filenames.append(f)

for f in os.listdir(NORMALIZED_PATH):
    if f.endswith(".json"): 
            normalized_filenames.append(f)

for f in os.listdir(REGRESSIONS_PATH):
    if f.endswith(".json"): 
            regression_filenames.append(f)

minify_data(7)
minify_normalized_data(7)
minify_regressions()
