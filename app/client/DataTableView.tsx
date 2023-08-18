"use client";

import {
  _currentMotionData,
  _currentOrientationData,
  _isSensorReady,
  useRecoilValue,
} from "@/_recoil/client";
import { Col, Row, Space, theme } from "antd";

import styles from "./DataTableView.module.css";

export default function DataTableView() {
  const isSensorReady = useRecoilValue(_isSensorReady);
  const currentMotionDataNumbered = useRecoilValue(_currentMotionData);
  const currentOrientationDataNumbered = useRecoilValue(
    _currentOrientationData
  );
  const {
    token: { magenta6, geekblue6, colorTextDisabled, colorText },
  } = theme.useToken();

  const currentMotionData = currentMotionDataNumbered
    .map((v) => v.toFixed(1).padStart(5, " "))
    .map((v) => (v === "-10000.0" ? "..." : v));

  const currentOrientationData = currentOrientationDataNumbered
    .map((v) => v.toFixed(1).padStart(5, " "))
    .map((v) => (v === "-10000.0" ? "..." : v));

  const colorMap = (v: number) => {
    if (v === -10000) {
      return colorTextDisabled;
    } else if (v > 0) {
      return geekblue6;
    } else if (v < 0) {
      return magenta6;
    } else {
      return colorText;
    }
  };

  const currentMotionDataColor = currentMotionDataNumbered.map(colorMap);
  const currentOrientationDataColor =
    currentOrientationDataNumbered.map(colorMap);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row
        style={{
          padding: "0 4px",
        }}
        gutter={8}
      >
        <Col flex={2}>Acc.X</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentMotionDataColor[0] }}
        >
          {isSensorReady ? currentMotionData[0] : "..."}
        </Col>
        <Col flex={2}>Gyro.X</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentMotionDataColor[7] }}
        >
          {isSensorReady ? currentMotionData[7] : "..."}
        </Col>
        <Col flex={2}>Rot.X</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentOrientationDataColor[7] }}
        >
          {isSensorReady ? currentOrientationData[7] : "..."}
        </Col>
      </Row>
      <Row
        style={{
          padding: "0 4px",
        }}
        gutter={8}
      >
        <Col flex={2}>Acc.Y</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentMotionDataColor[1] }}
        >
          {isSensorReady ? currentMotionData[1] : "..."}
        </Col>
        <Col flex={2}>Gyro.Y</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentMotionDataColor[8] }}
        >
          {isSensorReady ? currentMotionData[8] : "..."}
        </Col>
        <Col flex={2}>Rot.Y</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentOrientationDataColor[9] }}
        >
          {isSensorReady ? currentOrientationData[9] : "..."}
        </Col>
      </Row>
      <Row
        style={{
          padding: "0 4px",
        }}
        gutter={8}
      >
        <Col flex={2}>Acc.Z</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentMotionDataColor[2] }}
        >
          {isSensorReady ? currentMotionData[2] : "..."}
        </Col>
        <Col flex={2}>Gyro.Z</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentMotionDataColor[6] }}
        >
          {isSensorReady ? currentMotionData[6] : "..."}
        </Col>
        <Col flex={2}>Rot.Z</Col>
        <Col
          flex={3}
          className={styles.data}
          style={{ color: currentOrientationDataColor[6] }}
        >
          {isSensorReady ? currentOrientationData[6] : "..."}
        </Col>
      </Row>
    </Space>
  );
}
