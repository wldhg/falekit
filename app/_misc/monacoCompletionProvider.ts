import {
  Range,
  editor,
  languages,
  type CancellationToken,
  type Position,
} from "monaco-editor";

const commonCompletionRawList: string[][] = [
  ["load", 'load("식별자")', "저장한 로컬 데이터를 불러옵니다."],
  ["save", 'save("식별자", 값)', "로컬에 데이터를 저장합니다."],
  ["get_repeat_idx", "get_repeat_idx()", "현재 반복 실행 횟수를 리턴합니다."],
];

const clientCodeCompletionRawList: string[][] = [
  [
    "get_accel",
    "get_accel()",
    "가속도 센서의 값을 읽어옵니다. (x, y, z) 튜플을 반환합니다. 단위는 m/s²입니다.",
  ],
  ["get_accel_x", "get_accel_x()", "가속도 센서의 x축 값을 읽어옵니다."],
  ["get_accel_y", "get_accel_y()", "가속도 센서의 y축 값을 읽어옵니다."],
  ["get_accel_z", "get_accel_z()", "가속도 센서의 z축 값을 읽어옵니다."],
  [
    "get_accng",
    "get_accng()",
    "중력 상수가 제거된 가속도 센서의 값을 읽어옵니다. (x, y, z) 튜플을 반환합니다. 단위는 m/s²입니다.",
  ],
  [
    "get_accng_x",
    "get_accng_x()",
    "가속도 센서의 x축 중력 상수 제거 값을 읽어옵니다.",
  ],
  [
    "get_accng_y",
    "get_accng_y()",
    "가속도 센서의 y축 중력 상수 제거 값을 읽어옵니다.",
  ],
  [
    "get_accng_z",
    "get_accng_z()",
    "가속도 센서의 z축 중력 상수 제거 값을 읽어옵니다.",
  ],
  [
    "get_gyro",
    "get_gyro()",
    "자이로 센서의 값을 읽어옵니다. (x, y, z) 튜플을 반환합니다. 단위는 각도/초입니다.",
  ],
  [
    "get_gyro_x",
    "get_gyro_x()",
    "자이로 센서의 x축 회전각 변화 값을 읽어옵니다.",
  ],
  [
    "get_gyro_y",
    "get_gyro_y()",
    "자이로 센서의 y축 회전각 변화 값을 읽어옵니다.",
  ],
  [
    "get_gyro_z",
    "get_gyro_z()",
    "자이로 센서의 z축 회전각 변화 값을 읽어옵니다.",
  ],
  [
    "get_rot",
    "get_rot()",
    "회전 센서의 각도를 읽어옵니다. (x, y, z) 튜플을 반환합니다. -180도 ~ 180도 사이의 값입니다.",
  ],
  ["get_rot_x", "get_rot_x()", "회전 센서의 x축 각도를 읽어옵니다."],
  ["get_rot_y", "get_rot_y()", "회전 센서의 y축 각도를 읽어옵니다."],
  ["get_rot_z", "get_rot_z()", "회전 센서의 z축 각도를 읽어옵니다."],
  [
    "get_sensor_time",
    "get_sensor_time()",
    "센서의 시간 타임스탬프를 읽어옵니다.",
  ],
  ["send", 'send("식별자", 값)', "서버로 데이터를 전송합니다."],
];

export const clientCodeCompletionProvider: languages.CompletionItemProvider = {
  provideCompletionItems: (
    model: editor.ITextModel,
    position: Position,
    context: languages.CompletionContext,
    token: CancellationToken
  ): languages.ProviderResult<languages.CompletionList> => {
    const word = model.getWordUntilPosition(position);
    const wordRange = new Range(
      position.lineNumber,
      word.startColumn,
      position.lineNumber,
      word.endColumn
    );
    const list = [
      ...commonCompletionRawList,
      ...clientCodeCompletionRawList,
    ].map((item) => {
      return {
        label: item[0],
        kind: languages.CompletionItemKind.Function,
        documentation: item[2],
        insertText: item[1],
        range: wordRange,
      };
    });
    const filteredList = list.filter((item) => {
      return item.label.startsWith(word.word);
    });
    return {
      suggestions: filteredList,
    };
  },
};

const serverCodeCompletionRawList: string[][] = [
  [
    "get_data",
    'get_data("식별자", 개수)',
    "센서로부터 받아 저장해놓은 데이터를 읽어옵니다.",
  ],
  ["display", 'display("이름", 값)', "모니터에 값을 출력합니다."],
  [
    "act_led",
    'act_led("이름", "색상값")',
    "LED를 제어합니다. #000이면 검은색, #fff면 흰색입니다.",
  ],
  ["act_buzzer", 'act_buzzer("이름", 동작여부, 주파수)', "부저를 울립니다."],
  ["act_motor", 'act_motor("이름", RPM값)', "모터를 제어합니다."],
  [
    "act_servo",
    'act_servo("이름", 각도값)',
    "서보모터를 제어합니다. 각도는 0 ~ 360 사이입니다.",
  ],
];

export const serverCodeCompletionProvider: languages.CompletionItemProvider = {
  provideCompletionItems: (
    model: editor.ITextModel,
    position: Position,
    context: languages.CompletionContext,
    token: CancellationToken
  ): languages.ProviderResult<languages.CompletionList> => {
    const word = model.getWordUntilPosition(position);
    const wordRange = new Range(
      position.lineNumber,
      word.startColumn,
      position.lineNumber,
      word.endColumn
    );
    const list = [
      ...commonCompletionRawList,
      ...serverCodeCompletionRawList,
    ].map((item) => {
      return {
        label: item[0],
        kind: languages.CompletionItemKind.Function,
        documentation: item[2],
        insertText: item[1],
        range: wordRange,
      };
    });
    const filteredList = list.filter((item) => {
      return item.label.startsWith(word.word);
    });
    return {
      suggestions: filteredList,
    };
  },
};
