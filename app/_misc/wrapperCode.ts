export const clientWrapperCodePre = `
from pyodide.code import run_js as _run_js
from io import StringIO
import json as _wrap_json
import base64 as _wrap_base64
import builtins

_capture_out = StringIO()

def print(*args, **kwargs):
    builtins.print(*args, **kwargs, file=_capture_out)
    value = _capture_out.getvalue()
    _capture_out.truncate(0)
    _capture_out.seek(0)
    builtins.print(value, end='')
    value_b64 = _wrap_base64.b64encode(value.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.print('{value_b64}')")

def get_accel_x():
    return float(_run_js("self.__falekit.data[0]"))

def get_accel_y():
    return float(_run_js("self.__falekit.data[1]"))

def get_accel_z():
    return float(_run_js("self.__falekit.data[2]"))

def get_gyro_x():
    return float(_run_js("self.__falekit.data[3]"))

def get_gyro_y():
    return float(_run_js("self.__falekit.data[4]"))

def get_gyro_z():
    return float(_run_js("self.__falekit.data[5]"))

def get_timestamp():
    return float(_run_js("self.__falekit.data[6]"))

def send(name, data):
    json_data = _wrap_json.dumps(data)
    json_data_b64 = _wrap_base64.b64encode(json_data.encode('utf-8')).decode('utf-8')
    name_b64 = _wrap_base64.b64encode(name.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.send_list.push(['{name_b64}', '{json_data_b64}'])")

try:
`;

export const clientWrapperCodePost = `
except Exception as e:
    print(repr(e))
    _run_js("self.__falekit.exit_code = -1")
`;

export const serverWrapperCode = ``;
