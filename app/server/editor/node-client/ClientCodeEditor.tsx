"use client";

import { clientDefaultCode } from "@/_misc";
import { _clientCode } from "@/_recoil/server";
import { Typography } from "antd";
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
        <Typography.Title level={2}>센서 코드</Typography.Title>
        <Typography.Text>센서가 수행할 로직을 구성하세요.</Typography.Text>
      </div>
      <PythonCodeEditor
        valueRecoil={_clientCode}
        defaultValue={clientDefaultCode}
        style={{
          height: "100%",
        }}
      />
    </div>
  );
}
