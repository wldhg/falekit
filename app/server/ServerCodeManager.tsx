"use client";

import type { FaleGreenResponse, FaleRedResponse } from "@/_proto";
import {
  _isCodeRunning,
  _lastTimeCodeLoaded,
  _messageApi,
  _serverCodeOnMonitor,
  _themeName,
  _workerStatus,
  useRecoilState,
  useRecoilValue,
} from "@/_recoil/server";
import { Button, Col, Row, Space, Spin, Typography, theme } from "antd";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDarkReasonable as atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function ServerCodeManager() {
  const [serverCode, setServerCode] = useRecoilState(_serverCodeOnMonitor);
  const [lastTimeCodeLoaded, setLastTimeCodeLoaded] =
    useRecoilState(_lastTimeCodeLoaded);
  const [isCodeRunning, setIsCodeRunning] = useRecoilState(_isCodeRunning);
  const themeName = useRecoilValue(_themeName);
  const workerStatus = useRecoilValue(_workerStatus);
  const messageApi = useRecoilValue(_messageApi);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const {
    token: { colorBorder, borderRadius },
  } = theme.useToken();

  const updateServerCode = (e: any) => {
    setIsCodeLoading(true);
    fetch("/backend/load-code?type=server")
      .then((res) => res.json())
      .then((res: FaleGreenResponse | FaleRedResponse) => {
        if (res.code === "green") {
          setServerCode(res.data);
          setLastTimeCodeLoaded(Date.now());
        } else {
          messageApi?.error({
            content: `서버 코드 로드 실패 (${res.error})`,
          });
        }
        setIsCodeLoading(false);
      })
      .catch((err) => {
        messageApi?.error({
          content: `서버 코드 로드 중 오류 발생 (${err})`,
        });
        setIsCodeLoading(false);
      });
  };

  let clientStatus = "최초 로드 대기 중";
  if (lastTimeCodeLoaded > 0) {
    if (isCodeRunning) {
      clientStatus = workerStatus;
    } else {
      clientStatus = "실행 가능";
    }
  }

  let lastTimeCodeLoadedString = "로드한 적 없음";
  if (lastTimeCodeLoaded > 0) {
    lastTimeCodeLoadedString =
      new Date(lastTimeCodeLoaded).toLocaleString() + " 로드됨";
  }

  const runClientCode = () => {
    setIsCodeRunning(true);
  };

  const stopClientCode = () => {
    setIsCodeRunning(false);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row>
        <Col flex={1}>
          <Typography.Text>
            코드 상태&nbsp;:&nbsp;{clientStatus}
          </Typography.Text>
        </Col>
      </Row>
      <Row>
        <Col flex={1}>
          <Space>
            <Typography.Text type="secondary">
              {lastTimeCodeLoadedString}
            </Typography.Text>

            <Spin
              size="small"
              style={{
                filter: "brightness(1.5)",
              }}
              spinning={isCodeLoading}
            />
          </Space>
        </Col>
      </Row>
      <div
        style={{
          backgroundColor: themeName === "dark" ? "#292c33" : "#fafafa",
          border: `1px solid ${colorBorder}`,
          borderRadius: borderRadius,
          overflow: "hidden",
        }}
      >
        <SyntaxHighlighter
          language="python"
          style={themeName === "dark" ? atomOneDark : atomOneLight}
          customStyle={{
            fontFamily: "'Fira Mono', monospace",
            maxHeight: "20vh",
            maxWidth: "260px",
            width: "260px",
          }}
        >
          {serverCode}
        </SyntaxHighlighter>
      </div>
      <Row>
        <Col flex={3}>
          <Button
            type="primary"
            danger={isCodeRunning}
            onClick={isCodeRunning ? stopClientCode : runClientCode}
            disabled={lastTimeCodeLoaded === 0 || isCodeLoading}
            style={{ width: "100%", fontSize: "1.2rem", height: "3rem" }}
          >
            {isCodeRunning ? "코드 중지" : "코드 실행"}
          </Button>
        </Col>
        <Col flex={1}>
          <Button
            type="default"
            onClick={updateServerCode}
            disabled={isCodeLoading || isCodeRunning}
            style={{
              marginLeft: "8px",
              width: "calc(100% - 8px)",
              fontSize: "1.2rem",
              height: "3rem",
            }}
          >
            로드
          </Button>
        </Col>
      </Row>
    </Space>
  );
}
