import {
  Range,
  editor,
  languages,
  type CancellationToken,
  type Position,
} from "monaco-editor";

const clientCodeCompletionRawList: string[][] = [
  ["get_accel_x", "get_accel_x()", "가속도 센서의 x축 값을 읽어옵니다."],
  ["get_accel_y", "get_accel_y()", "가속도 센서의 y축 값을 읽어옵니다."],
  ["get_accel_z", "get_accel_z()", "가속도 센서의 z축 값을 읽어옵니다."],
  ["get_gyro_x", "get_gyro_x()", "자이로 센서의 x축 변화 값을 읽어옵니다."],
  ["get_gyro_y", "get_gyro_y()", "자이로 센서의 y축 변화 값을 읽어옵니다."],
  ["get_gyro_z", "get_gyro_z()", "자이로 센서의 z축 변화 값을 읽어옵니다."],
  [
    "get_gyro_accum_x",
    "get_gyro_accum_x()",
    "자이로 센서의 x축 변화 누적값을 읽어옵니다.",
  ],
  [
    "get_gyro_accum_y",
    "get_gyro_accum_y()",
    "자이로 센서의 y축 변화 누적값을 읽어옵니다.",
  ],
  [
    "get_gyro_accum_z",
    "get_gyro_accum_z()",
    "자이로 센서의 z축 변화 누적값을 읽어옵니다.",
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
    const list = clientCodeCompletionRawList.map((item) => {
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
    const list = serverCodeCompletionRawList.map((item) => {
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
