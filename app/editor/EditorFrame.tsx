"use client";

import ThemedLogo from "@/_components/ThemedLogo";
import {
  _isLeftSiderCollapsed,
  _isOnRendering,
  useRecoilState,
  useRecoilValue,
} from "@/_recoil/editor";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Spin, Typography, theme } from "antd";
import ServerNavigation from "./EditorNavigation";

const { Header, Sider, Content } = Layout;

export default function ServerFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOnRendering = useRecoilValue(_isOnRendering);
  const [collapsed, setCollapsed] = useRecoilState(_isLeftSiderCollapsed);
  const {
    token: { colorBgLayout, colorBgMask },
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
            fixedTo="light"
            style={{
              padding: collapsed ? "0 22%" : "0 30%",
              transition: "padding 0.2s",
              marginTop: "-10px",
            }}
          />
          <Typography.Text
            style={{
              position: "absolute",
              bottom: "20px",
              textAlign: "center",
              width: "100%",
              transition: "opacity 0.2s",
              opacity: collapsed ? 0 : 1,
              color: "whitesmoke",
            }}
          >
            서버 / 개발
          </Typography.Text>
        </div>
        <ServerNavigation />
      </Sider>
      <Layout style={{ position: "relative" }}>
        <Header style={{ padding: 0, backgroundColor: colorBgLayout }}>
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
        {isOnRendering && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: colorBgMask,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin size="large" />
          </div>
        )}
      </Layout>
    </Layout>
  );
}
