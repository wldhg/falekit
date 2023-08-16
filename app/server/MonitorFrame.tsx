"use client";

import ThemedLogo from "@/_components/ThemedLogo";
import { Col, Divider, Row, Typography } from "antd";
import MonitorDisplay from "./MonitorDisplay";
import ServerCodeManager from "./ServerCodeManager";
import ServerCodeRunner from "./ServerCodeRunner";

export default function MonitorFrame() {
  return (
    <div
      style={{
        padding: 32,
      }}
    >
      <Row wrap={false}>
        <Col
          flex="none"
          style={{
            height: "100%",
            width: "260px",
            marginRight: "10px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 64,
              height: 32,
              position: "relative",
              marginBottom: 16,
            }}
          >
            <ThemedLogo />
            <Typography.Text
              style={{
                display: "block",
                left: 70,
                top: 10,
                width: 100,
                position: "relative",
              }}
            >
              서버 / 모니터
            </Typography.Text>
          </div>
          <Typography.Title level={4}>서버 코드</Typography.Title>
          <ServerCodeManager />
          <Divider />
          <ServerCodeRunner />
        </Col>
        <Col flex="none">
          <Divider type="vertical" style={{ height: "100%" }} />
        </Col>
        <Col flex="auto" style={{ marginLeft: "10px" }}>
          <MonitorDisplay />
        </Col>
      </Row>
    </div>
  );
}
