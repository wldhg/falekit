export const serverDefaultCode = `# 할 일 : 서버가 받은 데이터를 표시용 데이터로 정제/산출하는 코드를 작성합니다.
#
# 아래는 센서로부터 마지막으로 보고받은 시간을 단순히 표시하는 예시입니다.

import time

last_reported_time = get_data("timestamp", 1)
if len(last_reported_time) > 0:
    display("마지막 보고 시간", last_reported_time[0][1])

time.sleep(0.5)
`;

export const clientDefaultCode = `# 할 일 : get_* 함수를 사용하여 센서 데이터를 가져오고, send 함수를 사용하여 데이터를 서버로 보내세요.
#
# 아래는 센서 데이터를 사용하지 않고, 단순히 센서의 시계를 서버로 보내는 예시입니다.

import time
import datetime

now_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")

print("현재 시간", type(now_time), now_time)
send("timestamp", now_time)

time.sleep(1)
`;
