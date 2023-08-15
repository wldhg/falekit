"use client";

import ThemedLogo from "@/_components/ThemedLogo";
import { _resetRotAccum, useSetRecoilState } from "@/_recoil/client";
import { Button, Col, Divider, Row, Space, Typography, theme } from "antd";
import { useEffect } from "react";
import ClientCodeManger from "./ClientCodeManager";
import ClientCodeRunner from "./ClientCodeRunner";
import Data3dView from "./Data3dView";
import DataTableView from "./DataTableView";

export default function ClientFrame() {
  const {
    token: { colorBgElevated, colorBorder },
  } = theme.useToken();
  const setResetRotAccum = useSetRecoilState(_resetRotAccum);

  useEffect(() => {
    fetch("/backend/give-ping?inc=true", {
      method: "GET",
    });

    const handleBeforeUnload = () => {
      fetch("/backend/give-ping?inc=false", {
        method: "GET",
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      fetch("/backend/give-ping?inc=false", {
        method: "GET",
      });
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
            marginBottom: "16px",
          }}
        >
          <Data3dView />
        </div>
        <Row>
          <Col flex={1}>
            <Typography.Text type="secondary">
              화살표 길이 = 가속도
            </Typography.Text>
          </Col>
          <Col>
            <Button
              onClick={() => {
                setResetRotAccum(true);
              }}
              size="small"
              type="primary"
            >
              자이로(회전) 센서 누적값 초기화
            </Button>
          </Col>
        </Row>
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
          padding: "0 16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <ClientCodeManger />
      </div>
      <Divider />
      <div
        style={{
          padding: "0 16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <ClientCodeRunner />
      </div>
      <div
        style={{
          width: "100%",
          height: "32px",
        }}
      ></div>
    </Space>
  );
}
