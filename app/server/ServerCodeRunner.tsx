import { serverWrapperCodePost, serverWrapperCodePre } from "@/_misc";
import {
  _isCodeRunning,
  _messageApi,
  _printedLog,
  _serverActuatorData,
  _serverCodeOnMonitor,
  _serverMonitorData,
  _themeName,
  _workerStatus,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "@/_recoil/server";
import { Typography, theme } from "antd";
import { useEffect, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDarkReasonable as atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

const workerURL = "/server-worker.js";

function decodeB64Bytes(base64: string): string {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes.buffer);
}

export default function ServerCodeRunner() {
  const [isCodeRunning, setIsCodeRunning] = useRecoilState(_isCodeRunning);
  const serverCode = useRecoilValue(_serverCodeOnMonitor);
  const messageApi = useRecoilValue(_messageApi);
  const themeName = useRecoilValue(_themeName);
  const [printedLog, setPrintedLog] = useRecoilState(_printedLog);
  const setWorkerStatus = useSetRecoilState(_workerStatus);
  const setServerMonitorData = useSetRecoilState(_serverMonitorData);
  const setServerActuatorData = useSetRecoilState(_serverActuatorData);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const {
    token: { colorBorder, borderRadius },
  } = theme.useToken();

  useEffect(() => {
    if (isCodeRunning) {
      setServerMonitorData({});

      const indentedServerCode = "    " + serverCode.split("\n").join("\n    ");
      const finalServerCode =
        serverWrapperCodePre + indentedServerCode + serverWrapperCodePost;

      const falekit = {
        reset: () => {
          setPrintedLog([]);
          setExitCode(null);
          setWorkerStatus("워커 대기 중");
        },
        status: (text: string) => {
          setWorkerStatus(text);
        },
        get_script: () => {
          return finalServerCode;
        },
        display: (b64_name: string, b64_data: string) => {
          const name = decodeB64Bytes(b64_name);
          const data = decodeB64Bytes(b64_data);
          const data_json = JSON.parse(data);
          let data_to_save = data_json;
          if (Array.isArray(data_json) && Array.isArray(data_json[0])) {
            const x = data_json[0];
            const y = data_json[1];
            data_to_save = [
              {
                x,
                y,
              },
            ];
          } else if (Array.isArray(data_json)) {
            data_to_save = [
              {
                x: data_json.map((_, i) => i),
                y: data_json,
              },
            ];
          } else if (typeof data_json === "object") {
            const data_keys = Object.keys(data_json);
            const data_values: any[][] = Object.values(data_json);
            data_to_save = [];
            for (let i = 0; i < data_keys.length; i++) {
              if (
                Array.isArray(data_values[i]) &&
                Array.isArray(data_values[i][0])
              ) {
                const x = data_values[i][0];
                const y = data_values[i][1];
                data_to_save.push({
                  x,
                  y,
                  name: data_keys[i],
                });
              } else if (Array.isArray(data_values[i])) {
                data_to_save.push({
                  x: data_values[i].map((_, i) => i),
                  y: data_values[i],
                  name: data_keys[i],
                });
              }
            }
          }
          setServerMonitorData((prev) => ({ ...prev, [name]: data_to_save }));
        },
        action: (
          act_type: string,
          b64_name: string,
          some_data1: any,
          some_data2: any = null
        ) => {
          const name = decodeB64Bytes(b64_name);

          if (act_type === "led") {
            setServerActuatorData((prev) => ({
              ...prev,
              [name]: {
                type: "led",
                color: decodeB64Bytes(some_data1),
              },
            }));
          } else if (act_type === "buzzer") {
            setServerActuatorData((prev) => ({
              ...prev,
              [name]: {
                type: "buzzer",
                status: (some_data1 as number) == 1 ? "on" : "off",
                frequency: some_data2 as number,
              },
            }));
          } else if (act_type === "motor") {
            setServerActuatorData((prev) => ({
              ...prev,
              [name]: {
                type: "motor",
                rpm: some_data1 as number,
              },
            }));
          } else if (act_type === "servo") {
            setServerActuatorData((prev) => ({
              ...prev,
              [name]: {
                type: "servo",
                angle: some_data1 as number,
              },
            }));
          }
        },
        finished: (code: number) => {
          setIsCodeRunning(false);
          setWorkerStatus("종료됨");
          if (code === 0) {
            messageApi?.success("코드 종료됨 (정상)");
          } else {
            messageApi?.error(`코드 종료됨 (비정상: ${code})`);
          }
          setExitCode(code);
        },
        print: (b64_msg: string) => {
          const msg = decodeB64Bytes(b64_msg);
          setPrintedLog((prev) => [...prev, msg]);
        },
      };

      const worker = new Worker(workerURL);
      worker.addEventListener("message", (e) => {
        const {
          type,
          id,
          payload,
        }: {
          type: string;
          id: string;
          payload: any[];
        } = e.data;
        if (Object.keys(falekit || {}).includes(type)) {
          const retval = (falekit as any)[type](...payload);
          worker.postMessage({
            type: `ret:${id}`,
            payload: retval,
          });
        } else {
          console.error("Unknown message from worker", e.data);
        }
      });

      return () => {
        worker.terminate();
      };
    }

    return () => {};
  }, [
    isCodeRunning,
    serverCode,
    setPrintedLog,
    messageApi,
    setIsCodeRunning,
    setWorkerStatus,
    setServerMonitorData,
    setServerActuatorData,
  ]);

  useEffect(() => {
    if (logRef.current) {
      const pre = logRef.current.firstElementChild;
      if (!pre) return;
      if (Math.abs(pre.scrollHeight - pre.clientHeight - pre.scrollTop) < 40) {
        pre.scrollTo(pre.scrollLeft, pre.scrollHeight);
      }
    }
  }, [printedLog]);

  return (
    <>
      <Typography.Text strong>실행 로그</Typography.Text>
      <div
        ref={logRef}
        style={{
          backgroundColor: themeName === "dark" ? "#292c33" : "#fafafa",
          border: `1px solid ${colorBorder}`,
          borderRadius: borderRadius,
          maxWidth: "calc(100vw - 32px)",
          overflow: "hidden",
          marginTop: 8,
        }}
      >
        <SyntaxHighlighter
          language="text"
          style={themeName === "dark" ? atomOneDark : atomOneLight}
          showLineNumbers
          customStyle={{
            fontFamily: "'Fira Mono', monospace",
            maxHeight: "15vh",
            maxWidth: "calc(100vw - 32px)",
            width: "calc(100vw - 32px)",
          }}
        >
          {printedLog.join("") +
            (exitCode == null ? "" : `\n[코드 종료됨: ${exitCode}]`)}
        </SyntaxHighlighter>
      </div>
    </>
  );
}
