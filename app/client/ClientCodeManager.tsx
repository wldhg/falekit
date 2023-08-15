"use client";

import {
  _clientCode,
  _isCodeRunning,
  _isSensorReady,
  _lastTimeCodeLoaded,
  useRecoilState,
  useRecoilValue,
} from "@/_recoil/client";
import { Button, Col, Input, Row, Space, Typography, message } from "antd";

export default function ClientCodeManager() {
  const [clientCode, setClientCode] = useRecoilState(_clientCode);
  const [lastTimeCodeLoaded, setLastTimeCodeLoaded] =
    useRecoilState(_lastTimeCodeLoaded);
  const [isCodeRunning, setIsCodeRunning] = useRecoilState(_isCodeRunning);
  const isSensorReady = useRecoilValue(_isSensorReady);
  const [messageApi, contextHolder] = message.useMessage();

  const updateClientCode = (e: any) => {};

  let clientStatus = "센서 코드 최초 로드 대기 중";
  if (lastTimeCodeLoaded > 0) {
    if (isCodeRunning) {
      clientStatus = "센서 코드 실행 중";
    } else {
      clientStatus = "센서 코드 실행 가능";
    }
  }
  if (!isSensorReady) {
    clientStatus = "센서 응답 대기 중";
  }

  let lastTimeCodeLoadedString = "업데이트 한 적 없음";
  if (lastTimeCodeLoaded > 0) {
    lastTimeCodeLoadedString =
      new Date(lastTimeCodeLoaded).toLocaleString() + " 업데이트";
  }

  const runClientCode = () => {};

  const stopClientCode = () => {};

  return (
    <>
      {contextHolder}
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row>
          <Col flex={1}>
            <Typography.Text>상태&nbsp;:&nbsp;{clientStatus}</Typography.Text>
          </Col>
        </Row>
        <Row>
          <Col flex={1}>
            <Typography.Text type="secondary">
              {lastTimeCodeLoadedString}
            </Typography.Text>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={updateClientCode}
              disabled={!isSensorReady}
              size="small"
            >
              센서 코드 업데이트
            </Button>
          </Col>
        </Row>
        <Input.TextArea
          value={clientCode}
          disabled
          style={{
            fontFamily: "'Fira Mono', monospace",
            whiteSpace: "pre",
          }}
        />
        <Button
          type="primary"
          danger={isCodeRunning}
          onClick={isCodeRunning ? stopClientCode : runClientCode}
          disabled={!isSensorReady || lastTimeCodeLoaded === 0}
          style={{ width: "100%", fontSize: "1.2rem", height: "3rem" }}
        >
          {isCodeRunning ? "코드 중지" : "코드 실행"}
        </Button>
      </Space>
    </>
  );
}
