export const clientWrapperCodePre = `
from pyodide.code import run_js as _run_js
from io import StringIO
import json as _wrap_json
import base64 as _wrap_base64
import builtins
import pickle as _wrap_pickle

_capture_out = StringIO()

def print(*args, **kwargs):
    builtins.print(*args, **kwargs, file=_capture_out)
    value = _capture_out.getvalue()
    _capture_out.truncate(0)
    _capture_out.seek(0)
    builtins.print(value, end='')
    value_b64 = _wrap_base64.b64encode(value.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.print('{value_b64}')")

def get_accel():
    return tuple(map(float, _run_js("self.__falekit.data.slice(0, 3)")))

def get_accel_x():
    return float(_run_js("self.__falekit.data[0]"))

def get_accel_y():
    return float(_run_js("self.__falekit.data[1]"))

def get_accel_z():
    return float(_run_js("self.__falekit.data[2]"))

def get_gyro():
    return tuple(map(float, _run_js("self.__falekit.data.slice(3, 6)")))

def get_gyro_x():
    return float(_run_js("self.__falekit.data[3]"))

def get_gyro_y():
    return float(_run_js("self.__falekit.data[4]"))

def get_gyro_z():
    return float(_run_js("self.__falekit.data[5]"))

def get_gyro_accum():
    return tuple(map(float, _run_js("self.__falekit.data.slice(6, 9)")))

def get_gyro_accum_x():
    return float(_run_js("self.__falekit.data[6]"))

def get_gyro_accum_y():
    return float(_run_js("self.__falekit.data[7]"))

def get_gyro_accum_z():
    return float(_run_js("self.__falekit.data[8]"))

def get_timestamp():
    return float(_run_js("self.__falekit.data[9]"))

def send(name, data):
    json_data = _wrap_json.dumps(data)
    json_data_b64 = _wrap_base64.b64encode(json_data.encode('utf-8')).decode('utf-8')
    name_b64 = _wrap_base64.b64encode(name.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.send_list.push(['{name_b64}', '{json_data_b64}'])")

def save(name, data):
    pkl_data = _wrap_pickle.dumps(data)
    pkl_data_b64 = _wrap_base64.b64encode(pkl_data).decode('utf-8')
    _run_js(f"self.__falekit.save_obj['{name_b64}'] = '{json_data_b64}'")

def load(name):
    name_b64 = _wrap_base64.b64encode(name.encode('utf-8')).decode('utf-8')
    pkl_data_b64 = _run_js(f"self.__falekit.save_obj['{name_b64}'] || 'omg__nope'")
    if pkl_data_b64 == 'omg__nope':
        return None
    pkl_data = _wrap_base64.b64decode(pkl_data_b64)
    return _wrap_pickle.loads(pkl_data)

def get_repeat_idx():
    return int(_run_js("self.__falekit.repeat_idx"))

try:
`;

export const clientWrapperCodePost = `
except Exception as e:
    print(repr(e))
    _run_js("self.__falekit.exit_code = -1")
`;

export const serverWrapperCodePre = `
from pyodide.code import run_js as _run_js
from pyodide.ffi import JsProxy
from io import StringIO
import json as _wrap_json
import base64 as _wrap_base64
import builtins
import pickle as _wrap_pickle

_capture_out = StringIO()

def print(*args, **kwargs):
    builtins.print(*args, **kwargs, file=_capture_out)
    value = _capture_out.getvalue()
    _capture_out.truncate(0)
    _capture_out.seek(0)
    builtins.print(value, end='')
    value_b64 = _wrap_base64.b64encode(value.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.print('{value_b64}')")

def get_data(name, cnt):
    data = _run_js(f"self.queryData('{name}', {cnt})")
    if isinstance(data, JsProxy):
        data = data.to_py()
    data = [tuple(d) for d in data]
    return data

def display(name, data):
    json_data = _wrap_json.dumps(data)
    json_data_b64 = _wrap_base64.b64encode(json_data.encode('utf-8')).decode('utf-8')
    name_b64 = _wrap_base64.b64encode(name.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.disp_list.push(['{name_b64}', '{json_data_b64}'])")

def act_led(name, color):
    color_b64 = _wrap_base64.b64encode(color.encode('utf-8')).decode('utf-8')
    name_b64 = _wrap_base64.b64encode(name.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.act_list.push(['led', '{name_b64}', '{color_b64}'])")

def act_motor(name, speed):
    speed_float = float(speed)
    name_b64 = _wrap_base64.b64encode(name.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.act_list.push(['motor', '{name_b64}', {speed_float}])")

def act_servo(name, angle):
    angle_float = float(angle)
    angle_float = (abs(angle_float // 360) * 360 + angle_float) % 360
    name_b64 = _wrap_base64.b64encode(name.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.act_list.push(['servo', '{name_b64}', {angle_float}])")

def act_buzzer(name, onoff, freq=-1):
    onoff_int = 1 if onoff else 0
    freq_float = float(freq)
    freq_float = max(40.0, freq_float)
    freq_float = min(1000.0, freq_float)
    name_b64 = _wrap_base64.b64encode(name.encode('utf-8')).decode('utf-8')
    _run_js(f"self.__falekit.act_list.push(['buzzer', '{name_b64}', {onoff_int}, {freq_float}])")

def save(name, data):
    pkl_data = _wrap_pickle.dumps(data)
    pkl_data_b64 = _wrap_base64.b64encode(pkl_data).decode('utf-8')
    _run_js(f"self.__falekit.save_obj['{name_b64}'] = '{json_data_b64}'")

def load(name):
    name_b64 = _wrap_base64.b64encode(name.encode('utf-8')).decode('utf-8')
    pkl_data_b64 = _run_js(f"self.__falekit.save_obj['{name_b64}'] || 'omg__nope'")
    if pkl_data_b64 == 'omg__nope':
        return None
    pkl_data = _wrap_base64.b64decode(pkl_data_b64)
    return _wrap_pickle.loads(pkl_data)

def get_repeat_idx():
    return int(_run_js("self.__falekit.repeat_idx"))

try:
`;

export const serverWrapperCodePost = `
except Exception as e:
    print(repr(e))
    _run_js("self.__falekit.exit_code = -1")
`;
