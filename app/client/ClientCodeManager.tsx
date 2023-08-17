"use client";

import type { FaleGreenResponse, FaleRedResponse } from "@/_proto";
import {
  _clientCode,
  _isCodeRunning,
  _isSensorReady,
  _lastTimeCodeLoaded,
  _messageApi,
  _themeName,
  _workerStatus,
  useRecoilState,
  useRecoilValue,
} from "@/_recoil/client";
import { Button, Col, Row, Space, Spin, Typography, theme } from "antd";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDarkReasonable as atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function ClientCodeManager() {
  const [clientCode, setClientCode] = useRecoilState(_clientCode);
  const [lastTimeCodeLoaded, setLastTimeCodeLoaded] =
    useRecoilState(_lastTimeCodeLoaded);
  const [isCodeRunning, setIsCodeRunning] = useRecoilState(_isCodeRunning);
  const isSensorReady = useRecoilValue(_isSensorReady);
  const themeName = useRecoilValue(_themeName);
  const workerStatus = useRecoilValue(_workerStatus);
  const messageApi = useRecoilValue(_messageApi);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const {
    token: { colorBorder, borderRadius },
  } = theme.useToken();

  const updateClientCode = (e: any) => {
    setIsCodeLoading(true);
    fetch("/backend/load-code?type=client")
      .then((res) => res.json())
      .then((res: FaleGreenResponse | FaleRedResponse) => {
        if (res.code === "green") {
          const code = res.data.slice(2);
          const isValid = res.data[0] === "1";
          setClientCode(code);
          setIsCodeValid(isValid);
          setLastTimeCodeLoaded(Date.now());
        } else {
          messageApi?.error({
            content: `센서 코드 로드 실패 (${res.error})`,
          });
        }
        setIsCodeLoading(false);
      })
      .catch((err) => {
        messageApi?.error({
          content: `센서 코드 로드 중 오류 발생 (${err})`,
        });
        setIsCodeLoading(false);
      });
  };

  let clientStatus = "최초 로드 대기 중";
  if (lastTimeCodeLoaded > 0) {
    if (isCodeRunning) {
      clientStatus = workerStatus;
    } else if (isCodeValid) {
      clientStatus = "실행 가능";
    } else {
      clientStatus = "실행 불가 (구문 오류)";
    }
  }
  if (!isSensorReady) {
    clientStatus = "센서 응답 대기 중";
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
          <Typography.Text type="secondary">
            {lastTimeCodeLoadedString}
          </Typography.Text>
        </Col>
        <Col>
          <Space>
            <Spin
              size="small"
              style={{
                filter: "brightness(1.5)",
              }}
              spinning={isCodeLoading}
            />
            <Button
              type="primary"
              onClick={updateClientCode}
              disabled={!isSensorReady || isCodeLoading || isCodeRunning}
              size="small"
            >
              센서 코드 로드
            </Button>
          </Space>
        </Col>
      </Row>
      <div
        style={{
          backgroundColor: themeName === "dark" ? "#292c33" : "#fafafa",
          border: `1px solid ${colorBorder}`,
          borderRadius: borderRadius,
          maxWidth: "calc(100vw - 32px)",
          overflow: "hidden",
        }}
      >
        <SyntaxHighlighter
          language="python"
          style={themeName === "dark" ? atomOneDark : atomOneLight}
          customStyle={{
            fontFamily: "'Fira Mono', monospace",
            maxHeight: "20vh",
            maxWidth: "calc(100vw - 32px)",
            width: "calc(100vw - 32px)",
          }}
        >
          {clientCode}
        </SyntaxHighlighter>
      </div>
      <Button
        type="primary"
        danger={isCodeRunning}
        onClick={isCodeRunning ? stopClientCode : runClientCode}
        disabled={
          !isSensorReady ||
          lastTimeCodeLoaded === 0 ||
          isCodeLoading ||
          !isCodeValid
        }
        style={{ width: "100%", fontSize: "1.2rem", height: "3rem" }}
      >
        {isCodeRunning ? "코드 중지" : "코드 실행"}
      </Button>
    </Space>
  );
}
