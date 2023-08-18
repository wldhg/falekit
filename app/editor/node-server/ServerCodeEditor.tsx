"use client";

import {
  commonFunctionDocs,
  serverCodeCompletionProvider,
  serverDefaultCode,
  serverFunctionDocs,
} from "@/_misc";
import { _serverCode } from "@/_recoil/editor";
import { Typography } from "antd";
import DocsPanel from "../DocsPanel";
import PythonCodeEditor from "../PythonCodeEditor";

export default function ServerCodeEditor() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ paddingBottom: 16 }}>
        <Typography.Title level={2}>서버 코드 편집기</Typography.Title>
        <Typography.Text>
          서버가 센서로부터 받아 저장된 데이터를 이용해 수행할 로직을
          구성하세요. 아래 코드는 반복적으로 실행될 예정이니, 실행 간격을{" "}
          <Typography.Text code>time.sleep()</Typography.Text>으로 조절하세요.
          반복 실행 간 데이터를 유지하려면{" "}
          <Typography.Text code>save()</Typography.Text> 및{" "}
          <Typography.Text code>load()</Typography.Text>를 사용하세요.
        </Typography.Text>
      </div>
      <PythonCodeEditor
        valueRecoil={_serverCode}
        defaultValue={serverDefaultCode}
        completionProvider={serverCodeCompletionProvider}
        saveTarget="/backend/save-code"
        saveType="server"
      >
        <DocsPanel docs={[...serverFunctionDocs, ...commonFunctionDocs]} />
      </PythonCodeEditor>
    </div>
  );
}
