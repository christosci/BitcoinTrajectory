import numpy as np
import math
from scipy.optimize import curve_fit
from scipy.stats.distributions import t
from constants import *
from process_data import *

def get_cl_from_se(se, z_score):
    return np.asarray(se) * z_score

def square(x):
    return x**2

def power(fx, a, b):
    return a*fx**b

def generalized_metcalfe(u, a=1.51, b=1.69):
    """
    u - active addresses
    """
    return math.exp(a)*(u**b)

def m2(n, s):
    """
    n - transactions or active addresses
    s - current supply
    """
    return 100*(n**1.5/s)

def log(x, a, b):
    if x == 0: return 0
    return 10**(a*np.log(x)-b)

def do_curve_fit(func, x, y, alpha=0.05):
    x = np.array(x, dtype=np.int64)
    y = np.array(y, dtype=np.int64)
    coeffs, pcov = curve_fit(func, x, y)
    n = len(y)
    p = len(coeffs)
    dof = max(0, n - p) # number of degrees of freedom
    # student-t value for the dof and confidence level
    tval = t.ppf(1.0-alpha/2.0, dof) 
    cl = np.multiply(np.sqrt(np.diag(pcov)), tval)
    return coeffs, cl

def create_regression(input_filepath, output_filepath, func):
    x, y = json_to_xy(input_filepath, START_TIMESTAMP, END_TIMESTAMP)
    x_stop = START_TIMESTAMP + REGRESSION_TIMESPAN
    coeffs, cl = do_curve_fit(func, x, y)
    values = regression_to_xy_dict(START_TIMESTAMP, x_stop, REGRESSION_X_STEP, func, coeffs, cl)
    xy_to_json(output_filepath, coeffs.tolist(), values)

def plot_function(output_filepath, x_start, func, coeffs):
    x_stop = START_TIMESTAMP + REGRESSION_TIMESPAN
    values = regression_to_xy_dict(x_start, x_stop, REGRESSION_X_STEP, log, coeffs)
    xy_to_json(output_filepath, coeffs.tolist(), values)
