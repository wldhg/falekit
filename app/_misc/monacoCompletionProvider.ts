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
  ["get_gyro_x", "get_gyro_x()", "자이로 센서의 x축 값을 읽어옵니다."],
  ["get_gyro_y", "get_gyro_y()", "자이로 센서의 y축 값을 읽어옵니다."],
  ["get_gyro_z", "get_gyro_z()", "자이로 센서의 z축 값을 읽어옵니다."],
  ["send", 'send("키이름", 값변수)', "서버로 데이터를 전송합니다."],
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
