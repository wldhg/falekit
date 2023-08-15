"use client";

import {
  _currentSensorData,
  _isSensorReady,
  useRecoilValue,
} from "@/_recoil/client";
import { Col, Row, Space, theme } from "antd";

import styles from "./DataTableView.module.css";

export default function DataTableView() {
  const isSensorReady = useRecoilValue(_isSensorReady);
  const currentSensorDataNumbered = useRecoilValue(_currentSensorData);
  const {
    token: { magenta6, geekblue6, colorTextDisabled, colorText },
  } = theme.useToken();

  const currentSensorData = currentSensorDataNumbered
    .map((v) => v.toFixed(4).padStart(8, " "))
    .map((v) => (v === "-10000.0000" ? "..." : v));

  const currentSensorDataColor = currentSensorDataNumbered.map((v) => {
    if (v === -10000) {
      return colorTextDisabled;
    } else if (v > 0) {
      return geekblue6;
    } else if (v < 0) {
      return magenta6;
    } else {
      return colorText;
    }
  });

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row
        style={{
          padding: "0 16px",
        }}
        gutter={8}
      >
        <Col flex={1}>Acc.X</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentSensorDataColor[0] }}
        >
          {isSensorReady ? currentSensorData[0] : "..."}
        </Col>
        <Col flex={1}>Gyro.X</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentSensorDataColor[3] }}
        >
          {isSensorReady ? currentSensorData[3] : "..."}
        </Col>
      </Row>
      <Row
        style={{
          padding: "0 16px",
        }}
        gutter={8}
      >
        <Col flex={1}>Acc.Y</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentSensorDataColor[1] }}
        >
          {isSensorReady ? currentSensorData[1] : "..."}
        </Col>
        <Col flex={1}>Gyro.Y</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentSensorDataColor[4] }}
        >
          {isSensorReady ? currentSensorData[4] : "..."}
        </Col>
      </Row>
      <Row
        style={{
          padding: "0 16px",
        }}
        gutter={8}
      >
        <Col flex={1}>Acc.Z</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentSensorDataColor[2] }}
        >
          {isSensorReady ? currentSensorData[2] : "..."}
        </Col>
        <Col flex={1}>Gyro.Z</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentSensorDataColor[5] }}
        >
          {isSensorReady ? currentSensorData[5] : "..."}
        </Col>
      </Row>
      <Row
        style={{
          padding: "0 16px",
        }}
        gutter={8}
      >
        <Col flex={1}>Time</Col>
        <Col flex={3} className={styles.data}>
          {isSensorReady ? currentSensorData[9] : "..."}
        </Col>
      </Row>
    </Space>
  );
}
