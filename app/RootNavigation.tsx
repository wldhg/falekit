"use client";

import ThemedLogo from "@/_components/ThemedLogo";
import {
  DesktopOutlined,
  EditOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";

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
      <Button onClick={openEditorPage} icon={<EditOutlined />}>
        에디터 열기
      </Button>
      <Button onClick={openClientPage} icon={<MobileOutlined />}>
        클라이언트(센서) 페이지 열기
      </Button>
      <Button onClick={openServerPage} icon={<DesktopOutlined />}>
        서버(모니터) 페이지 열기
      </Button>
    </Space>
  );
}
