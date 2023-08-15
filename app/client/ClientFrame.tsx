"use client";

import ThemedLogo from "@/_components/ThemedLogo";
import { Divider, Space, Typography, theme } from "antd";
import ClientCodeManger from "./ClientCodeManager";
import Data3dView from "./Data3dView";
import DataTableView from "./DataTableView";

export default function ClientFrame() {
  const {
    token: { colorBgElevated, colorBorder },
  } = theme.useToken();

  return (
    <Space direction="vertical">
      <Space
        style={{
          padding: "8px 16px",
          height: "64px",
          width: "100vw",
          backgroundColor: colorBgElevated,
          borderBottom: `1px solid ${colorBorder}`,
        }}
      >
        <div
          style={{
            height: "32px",
            position: "relative",
            width: "64px",
          }}
        >
          <ThemedLogo />
        </div>
        <Typography.Text
          style={{ lineHeight: "32px", display: "block", height: "24px" }}
        >
          센서 클라이언트
        </Typography.Text>
      </Space>
      <div
        style={{
          padding: "16px 16px 0 16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            border: `1px solid ${colorBorder}`,
            backgroundColor: colorBgElevated,
            height: "160px",
          }}
        >
          <Data3dView />
        </div>
      </div>
      <div
        style={{
          padding: "16px 16px 0 16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <DataTableView />
      </div>
      <Divider />
      <div
        style={{
          padding: "0 16px 16px 16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <ClientCodeManger />
      </div>
    </Space>
  );
}
