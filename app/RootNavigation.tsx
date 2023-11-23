"use client";

import ThemedLogo from "@/_components/ThemedLogo";
import {
  DesktopOutlined,
  EditOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import { Button, Space, Typography } from "antd";

const navigationButtonStyle = {
  display: "inline-block",
  marginRight: "12px",
  marginBottom: "12px",
  minWidth: "200px",
  width: "240px",
  minHeight: "100px",
  maxWidth: "24vw",
  height: "240px",
  maxHeight: "24vw",
  verticalAlign: "middle",
  position: "relative",
} as const;

const navigationTextStyle = {
  top: 10,
  left: 14,
  position: "absolute",
  textAlign: "left",
  fontSize: "max(min(2.5vw, 16pt), 12pt)",
} as const;

const navigationIconStyle = {
  position: "absolute",
  fontSize: "min(10vw, 100px)",
} as const;

export default function RootNavigation() {
  const openEditorPage = () => {
    window.open("/editor", "_self");
  };

  const openServerPage = () => {
    window.open("/server", "_self");
  };

  const openClientPage = () => {
    window.open("/client", "_self");
  };

  return (
    <Space
      style={{
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
      direction="vertical"
      align="center"
    >
      <div
        style={{
          width: "65px",
          height: "80px",
          position: "relative",
        }}
      >
        <ThemedLogo />
      </div>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Button onClick={openEditorPage} style={navigationButtonStyle}>
          <Typography.Title level={3} style={navigationTextStyle}>
            에디터 열기
          </Typography.Title>
          <EditOutlined
            style={{ bottom: 10, right: 10, ...navigationIconStyle }}
          />
        </Button>
        <Button onClick={openClientPage} style={navigationButtonStyle}>
          <Typography.Title level={3} style={navigationTextStyle}>
            클라이언트(센서)
            <br />
            페이지 열기
          </Typography.Title>
          <MobileOutlined
            style={{ bottom: 12, right: 10, ...navigationIconStyle }}
          />
        </Button>
        <Button onClick={openServerPage} style={navigationButtonStyle}>
          <Typography.Title level={3} style={navigationTextStyle}>
            서버(모니터)
            <br />
            페이지 열기
          </Typography.Title>
          <DesktopOutlined
            style={{ bottom: 5, right: 10, ...navigationIconStyle }}
          />
        </Button>
      </div>
    </Space>
  );
}
