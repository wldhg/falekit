"use client";

import ThemedLogo from "@/_components/ThemedLogo";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Typography, theme } from "antd";
import { useState } from "react";
import MenuItems from "./MenuItems";

const { Header, Sider, Content } = Layout;

export default function ServerFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgBase },
  } = theme.useToken();

  return (
    <Layout
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            width: "100%",
            height: "100px",
            position: "relative",
          }}
        >
          <ThemedLogo
            style={{
              padding: collapsed ? "0 22%" : "0 30%",
              transition: "padding 0.3s",
              marginTop: "-10px",
            }}
          />
          <Typography.Text
            style={{
              position: "absolute",
              bottom: "20px",
              textAlign: "center",
              width: "100%",
              transition: "opacity 0.3s",
              opacity: collapsed ? 0 : 1,
            }}
          >
            서버 / 개발
          </Typography.Text>
        </div>
        <MenuItems />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, backgroundColor: colorBgBase }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
