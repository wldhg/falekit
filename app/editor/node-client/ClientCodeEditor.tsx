"use client";

import {
  clientCodeCompletionProvider,
  clientDefaultCode,
  clientFunctionDocs,
  commonFunctionDocs,
} from "@/_misc";
import { _clientCode } from "@/_recoil/editor";
import { Typography } from "antd";
import DocsPanel from "../DocsPanel";
import PythonCodeEditor from "../PythonCodeEditor";

export default function ClientCodeEditor() {
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
        <Typography.Title level={2}>센서 코드 편집기</Typography.Title>
        <Typography.Text>
          센서가 반복해서 수행할 로직을 구성하세요. 아래 코드는 센서가 멈출
          때까지 끊임없이 반복되며, 센서 값은 아래 코드가 한 번 실행될 때마다
          업데이트됩니다. 실행 간격을{" "}
          <Typography.Text code>time.sleep()</Typography.Text>으로 조절할 수
          있습니다. 반복 실행 간 데이터를 유지하려면{" "}
          <Typography.Text code>save()</Typography.Text> 및{" "}
          <Typography.Text code>load()</Typography.Text>를 사용할 수 있습니다.
        </Typography.Text>
      </div>
      <PythonCodeEditor
        valueRecoil={_clientCode}
        defaultValue={clientDefaultCode}
        completionProvider={clientCodeCompletionProvider}
        saveTarget="/backend/save-code"
        saveType="client"
      >
        <DocsPanel docs={[...clientFunctionDocs, ...commonFunctionDocs]} />
      </PythonCodeEditor>
    </div>
  );
}
