import type { FaleGreenResponse, FaleRedResponse } from "@/_proto";
import {
  _isCodeRunning,
  _messageApi,
  _serverActuatorData,
  _serverMonitorData,
  useRecoilState,
  useRecoilValue,
} from "@/_recoil/server";
import {
  BulbOutlined,
  DashboardOutlined,
  SoundOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  Divider,
  Row,
  Space,
  Typography,
  theme,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Oscillator } from "tone";

function MonitorBlockBase(props: {
  title: React.ReactNode;
  children: React.ReactNode;
  bottomPadding?: boolean;
  narrowMinWidth?: boolean;
  specialFrame?: boolean;
}) {
  const {
    token: {
      colorBgElevated,
      colorBorder,
      borderRadius,
      colorPrimaryBorder,
      colorPrimaryBg,
    },
  } = theme.useToken();
  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: props.specialFrame ? colorPrimaryBg : colorBgElevated,
        border: `1px solid ${
          props.specialFrame ? colorPrimaryBorder : colorBorder
        }`,
        borderRadius: borderRadius,
        paddingTop: 12,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: props.bottomPadding ? 16 : 4,
        margin: 8,
        minWidth: props.narrowMinWidth ? 100 : 200,
      }}
    >
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
        size={0}
      >
        <Typography.Title level={5}>{props.title}</Typography.Title>
        <Divider style={{ margin: 0 }} />
        {props.children}
      </Space>
    </div>
  );
}

function MonitorDisplaySingle(props: {
  title: string;
  data: string;
  font: "sans-serif" | "monospace" | "serif";
}) {
  const fontFamily = {
    "sans-serif": "'Pretendard', sans-serif",
    monospace: "'Fira Code', monospace",
    serif: "'Noto Serif', serif",
  }[props.font];

  return (
    <MonitorBlockBase title={props.title}>
      <div
        style={{
          width: "100%",
          height: 65,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography.Text
          strong
          style={{
            fontSize: 20,
            fontFamily,
          }}
        >
          {props.data}
        </Typography.Text>
      </div>
    </MonitorBlockBase>
  );
}

function MonitorDisplayPlot(props: {
  title: string;
  data: {
    x: number[];
    y: number[];
    name?: string;
  }[];
}) {
  return (
    <MonitorBlockBase title={props.title} bottomPadding>
      <Plot
        data={props.data.map((data, index) => ({
          x: data.x,
          y: data.y,
          name: data?.name ?? `Series ${index + 1}`,
          type: typeof data.x[0] === "string" ? "bar" : "scatter",
          mode: "lines+markers",
        }))}
        layout={{
          width: 320,
          height: 200,
          margin: {
            l: 40,
            r: 25,
            b: 20,
            t: 20,
          },
          legend: {
            orientation: "h",
            y: 1.1,
          },
        }}
      />
    </MonitorBlockBase>
  );
}

function MonitorActuatorLED(props: {
  title: string;
  data: {
    type: "led";
    color: string;
  };
}) {
  const isCodeRunning = useRecoilValue(_isCodeRunning);
  return (
    <MonitorBlockBase
      title={
        <>
          <BulbOutlined />
          &nbsp;&nbsp;{props.title}
        </>
      }
      specialFrame
      narrowMinWidth
    >
      <div style={{ width: "100%", paddingTop: 8, paddingBottom: 8 }}>
        <div
          style={{
            margin: "auto",
            width: 30,
            height: 30,
            borderRadius: 15,
            border: "1px solid gray",
            backgroundColor: isCodeRunning ? props.data.color : "black",
          }}
        />
      </div>
    </MonitorBlockBase>
  );
}

function MonitorActuatorBuzzer(props: {
  title: string;
  data: {
    type: "buzzer";
    status: "on" | "off";
    frequency: number;
  };
}) {
  const [oscillator, _] = useState<Oscillator>(
    new Oscillator(props.data.frequency, "sine").toDestination()
  );
  const isCodeRunning = useRecoilValue(_isCodeRunning);

  useEffect(() => {
    oscillator.volume.value = -10;
    oscillator.frequency.value = props.data.frequency;
    if (props.data.status === "on" && isCodeRunning) {
      oscillator.start();
    } else {
      oscillator.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data.frequency, props.data.status, isCodeRunning]);

  let statusText = "OFF";
  if (props.data.status === "on" && isCodeRunning) {
    statusText = "ON";
  }

  return (
    <MonitorBlockBase
      title={
        <>
          <SoundOutlined />
          &nbsp;&nbsp;{props.title}
        </>
      }
      specialFrame
      narrowMinWidth
    >
      <div style={{ width: "100%", paddingTop: 8, paddingBottom: 8 }}>
        <Row style={{ marginTop: 8, marginBottom: 4 }}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <Image
              src="/buzzer.png"
              style={{
                margin: "auto",
                animation:
                  statusText === "ON" ? "shak 0.1s linear infinite" : "none",
                filter: isCodeRunning ? "none" : "grayscale(100%)",
              }}
              width={45}
              height={45}
              alt="Buzzer"
            />
          </div>
        </Row>
        <Row style={{ textAlign: "center", width: "100%" }}>
          <Typography.Text strong style={{ fontSize: 16, margin: "auto" }}>
            {props.data.frequency} Hz {statusText}{" "}
          </Typography.Text>
        </Row>
      </div>
    </MonitorBlockBase>
  );
}

function MonitorActuatorMotor(props: {
  title: string;
  data: {
    type: "motor";
    rpm: number;
  };
}) {
  const isCodeRunning = useRecoilValue(_isCodeRunning);

  let speed = 0;
  let rpm = 0;
  if (props.data.rpm > 0) {
    speed = 1 / (props.data.rpm / 60);
    rpm = props.data.rpm;
  }

  return (
    <MonitorBlockBase
      title={
        <>
          <WalletOutlined />
          &nbsp;&nbsp;{props.title}
        </>
      }
      specialFrame
      narrowMinWidth
    >
      <div style={{ width: "100%", paddingTop: 8, paddingBottom: 8 }}>
        <Row style={{ marginTop: 8, marginBottom: 4 }}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <Image
              src="/propeller.png"
              style={{
                margin: "auto",
                animation:
                  isCodeRunning && speed !== 0
                    ? `rotate ${speed}s linear infinite`
                    : "none",
                filter: isCodeRunning ? "none" : "grayscale(100%)",
              }}
              width={65}
              height={65}
              alt="Propeller"
            />
          </div>
        </Row>
        <Row style={{ textAlign: "center", width: "100%" }}>
          <Typography.Text strong style={{ fontSize: 16, margin: "auto" }}>
            RPM: {rpm.toFixed(2)}
          </Typography.Text>
        </Row>
      </div>
    </MonitorBlockBase>
  );
}

function MonitorActuatorServo(props: {
  title: string;
  data: {
    type: "servo";
    angle: number;
  };
}) {
  return (
    <MonitorBlockBase
      title={
        <>
          <DashboardOutlined />
          &nbsp;&nbsp;{props.title}
        </>
      }
      specialFrame
      narrowMinWidth
    >
      <div style={{ width: "100%", paddingTop: 8, paddingBottom: 8 }}>
        <Row style={{ marginTop: 8 }}>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              background: "rgba(200, 200, 200, 0.6)",
              borderRadius: "6px",
            }}
          >
            <Image
              src="/servo.png"
              style={{
                margin: "auto",
                transform: `rotate(${props.data.angle}deg)`,
                transition: "transform 0.2s linear",
                filter: "grayscale(100%)",
              }}
              width={100}
              height={100}
              alt="Servo"
            />
          </div>
        </Row>
      </div>
    </MonitorBlockBase>
  );
}

export default function MonitorDisplay() {
  const [serverMonitorData, setServerMonitorData] =
    useRecoilState(_serverMonitorData);
  const [serverActuatorData, setServerActuatorData] =
    useRecoilState(_serverActuatorData);
  const messageApi = useRecoilValue(_messageApi);
  const serverMonitorDataKeys = Object.keys(serverMonitorData);
  const serverActuatorDataKeys = Object.keys(serverActuatorData);
  const [pingClientCount, setPingClientCount] =
    useState("연결을 불러오는 중입니다.");
  const [pingStatus, setPingStatus] = useState<
    "success" | "warning" | "info" | "error"
  >("info");

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/backend/take-ping", {
        method: "GET",
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            return null;
          }
        })
        .then((data: FaleGreenResponse | FaleRedResponse | null) => {
          if (data === null) {
            return;
          } else {
            if (data.code === "green") {
              const intParsed = Number.parseInt(data.data);
              if (intParsed === 0) {
                setPingClientCount("연결된 센서가 없습니다.");
                setPingStatus("warning");
              } else if (intParsed > 1) {
                setPingClientCount(
                  `${data.data}개 센서가 연결되어 있습니다. 불필요한 센서의 탭을 닫아주세요.`
                );
                setPingStatus("error");
              } else {
                setPingClientCount(`${data.data}개 센서가 연결되어 있습니다.`);
                setPingStatus("success");
              }
            } else {
              console.log("ping error", data);
            }
          }
        });
    }, 1000);

    return () => clearInterval(interval);
  });

  const requestInitData = () => {
    fetch("/backend/init?target=data", { method: "GET" })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log("init error", res);
          messageApi?.error("데이터 초기화에 실패했습니다. (요청 오류)");
        }
      })
      .then((res: FaleGreenResponse | FaleRedResponse | null) => {
        if (res !== null) {
          if (res.code === "green") {
            messageApi?.success("기존 데이터를 지웠습니다.");
          } else {
            messageApi?.error("데이터 초기화 실패 (서버 오류)");
          }
        }
      });
  };

  const initMonitor = () => {
    setServerMonitorData({});
    setServerActuatorData({});
  };

  const backupData = () => {
    fetch("/backend/backup-data", { method: "GET" })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log("backup error", res);
          messageApi?.error("데이터 백업 실패 (요청 오류)");
        }
      })
      .then((res: FaleGreenResponse | FaleRedResponse | null) => {
        if (res !== null) {
          if (res.code === "green") {
            const zipBase64 = res.data;
            const zipBlob = Buffer.from(zipBase64, "base64");
            const zipBlobUrl = URL.createObjectURL(new Blob([zipBlob]));
            const a = document.createElement("a");
            a.href = zipBlobUrl;
            a.download = `FaleKit-data-${new Date().toISOString()}.zip`;
            a.click();
          } else {
            messageApi?.error("데이터 백업 실패 (서버 오류)");
          }
        }
      });
  };

  return (
    <Space
      style={{
        width: "100%",
      }}
      direction="vertical"
    >
      <Row>
        <Col flex={1}>
          <Alert
            type={pingStatus}
            message={pingClientCount}
            style={{
              border: "none",
              backgroundColor: "transparent",
            }}
            showIcon
          />
        </Col>
        <Col>
          <Button
            onClick={requestInitData}
            danger
            style={{ marginRight: "8px" }}
          >
            데이터 초기화
          </Button>
        </Col>
        <Col>
          <Button onClick={initMonitor} style={{ marginRight: "8px" }}>
            모니터 초기화
          </Button>
        </Col>
        <Col>
          <Button onClick={backupData} type="primary">
            데이터 다운로드
          </Button>
        </Col>
      </Row>
      <Divider style={{ margin: "8px 0" }} />
      <div>
        {serverActuatorDataKeys.length > 0 ? (
          serverActuatorDataKeys.map((label) => {
            let dispData = serverActuatorData[label];
            if (dispData.type === "led") {
              return (
                <MonitorActuatorLED
                  key={`act-${label}`}
                  title={label}
                  data={dispData}
                />
              );
            } else if (dispData.type === "buzzer") {
              return (
                <MonitorActuatorBuzzer
                  key={`act-${label}`}
                  title={label}
                  data={dispData}
                />
              );
            } else if (dispData.type === "motor") {
              return (
                <MonitorActuatorMotor
                  key={`act-${label}`}
                  title={label}
                  data={dispData}
                />
              );
            } else if (dispData.type === "servo") {
              return (
                <MonitorActuatorServo
                  key={`act-${label}`}
                  title={label}
                  data={dispData}
                />
              );
            } else {
              return null;
            }
          })
        ) : (
          <Typography.Text>
            이곳에 곧 가상 액츄에이터가 표시됩니다. 아직은 사용된 액츄에이터가
            없습니다. 한 번도 서버 코드를 실행하지 않았거나 서버 코드 안의{" "}
            <Typography.Text code>act_*</Typography.Text> 함수가 실행된 적이
            없습니다.
          </Typography.Text>
        )}
      </div>
      <Divider style={{ margin: "8px 0" }} />
      <div>
        {serverMonitorDataKeys.length > 0 ? (
          serverMonitorDataKeys.map((label) => {
            let dispData = serverMonitorData[label];
            if (
              typeof dispData === "string" ||
              typeof dispData === "number" ||
              typeof dispData === "boolean"
            ) {
              let dispFont: "sans-serif" | "serif" | "monospace" = "sans-serif";
              if (typeof dispData === "boolean") {
                dispData = dispData ? "true" : "false";
                dispFont = "monospace";
              } else if (typeof dispData === "number") {
                dispData = dispData.toFixed(3);
                dispFont = "serif";
              }
              return (
                <MonitorDisplaySingle
                  key={`mon-${label}`}
                  title={label}
                  data={dispData}
                  font={dispFont}
                />
              );
            } else {
              return (
                <MonitorDisplayPlot
                  key={`mon-${label}`}
                  title={label}
                  data={dispData}
                />
              );
            }
          })
        ) : (
          <Typography.Text>
            표시할 데이터가 아직 없습니다. 한 번도 서버 코드를 실행하지 않았거나
            서버 코드 안의 <Typography.Text code>display</Typography.Text>{" "}
            함수가 실행된 적이 없습니다.
          </Typography.Text>
        )}
      </div>
    </Space>
  );
}
