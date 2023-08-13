"use client";

import PythonCodeEditor from "@/_components/PythonCodeEditor";
import { serverDefaultCode } from "@/_misc";
import { _serverCode } from "@/_recoil";
import { Typography } from "antd";

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
        <Typography.Title level={2}>서버 코드</Typography.Title>
        <Typography.Text>
          서버가 센서로부터 데이터를 받았을 때 수행할 로직을 구성하세요.
        </Typography.Text>
      </div>
      <PythonCodeEditor
        valueRecoil={_serverCode}
        defaultValue={serverDefaultCode}
        style={{
          height: "100%",
        }}
      />
    </div>
  );
}