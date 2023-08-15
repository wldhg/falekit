export const serverDefaultCode = `# on_recv 함수를 사용하여 데이터를 받았을 때 실행할 코드를 작성합니다.
def on_recv(name, data):
    if name == "temp":
        print("온도: ", data)
`;

export const clientDefaultCode = `# get_* 함수를 사용하여 데이터를 받고, send 함수를 사용하여 데이터를 보냅니다.
# 사용할 수 있는 get_* 함수:
#   get_accel_x, get_accel_y, get_accel_z, get_camera, get_gyro_x, get_gyro_y, get_gyro_z

import datetime

print("현재 시간", datetime.datetime.now())
`;
