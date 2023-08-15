import type { FaleGreenResponse, FaleRedResponse } from "@/_proto";
import {
  _messageApi,
  _serverMonitorData,
  useRecoilState,
  useRecoilValue,
} from "@/_recoil/server";
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
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

function MonitorDisplayBase(props: {
  title: string;
  children: React.ReactNode;
}) {
  const {
    token: { colorBgElevated, colorBorder, borderRadius },
  } = theme.useToken();
  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: colorBgElevated,
        border: `1px solid ${colorBorder}`,
        borderRadius: borderRadius,
        padding: 16,
        margin: 8,
        minWidth: 300,
      }}
    >
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <Typography.Title level={4}>{props.title}</Typography.Title>
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
    <MonitorDisplayBase title={props.title}>
      <div
        style={{
          width: "100%",
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography.Text
          strong
          style={{
            fontSize: 32,
            fontFamily,
          }}
        >
          {props.data}
        </Typography.Text>
      </div>
    </MonitorDisplayBase>
  );
}

function MonitorDisplayPlot(props: {
  title: string;
  data: {
    x: number[];
    y: number[];
  };
}) {
  return (
    <MonitorDisplayBase title={props.title}>
      <Plot
        data={[
          {
            x: props.data.x,
            y: props.data.y,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "blue" },
          },
        ]}
        layout={{
          width: 300,
          height: 160,
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
          },
        }}
      />
    </MonitorDisplayBase>
  );
}

export default function MonitorDisplay() {
  const [serverMonitorData, setServerMonitorData] =
    useRecoilState(_serverMonitorData);
  const messageApi = useRecoilValue(_messageApi);
  const serverMonitorDataKeys = Object.keys(serverMonitorData);
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
          <Button onClick={initMonitor} style={{ marginRight: "8px" }}>
            모니터 초기화
          </Button>
        </Col>
        <Col>
          <Button onClick={requestInitData} danger>
            데이터 초기화
          </Button>
        </Col>
      </Row>
      <Divider style={{ margin: "8px 0" }} />
      <div>
        {serverMonitorDataKeys.length > 0 ? (
          serverMonitorDataKeys.map((label, index) => {
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
                  key={`mon-${label}-${index}`}
                  title={label}
                  data={dispData}
                  font={dispFont}
                />
              );
            } else {
              return (
                <MonitorDisplayPlot
                  key={`mon-${label}-${index}`}
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
