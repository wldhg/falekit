"use client";

import { serverCodeCompletionProvider, serverDefaultCode } from "@/_misc";
import { _serverCode } from "@/_recoil/editor";
import { Typography } from "antd";
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
          서버가 센서로부터 받은 데이터를 이용해 수행할 로직을 구성하세요.
        </Typography.Text>
      </div>
      <PythonCodeEditor
        valueRecoil={_serverCode}
        defaultValue={serverDefaultCode}
        completionProvider={serverCodeCompletionProvider}
        saveTarget="/backend/save-code"
        saveType="server"
        style={{
          height: "100%",
        }}
      />
    </div>
  );
}
