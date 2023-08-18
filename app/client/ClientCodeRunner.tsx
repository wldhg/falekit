import { clientWrapperCodePost, clientWrapperCodePre } from "@/_misc";
import type {
  FaleGreenResponse,
  FaleRedResponse,
  SaveDataRequest,
} from "@/_proto";
import {
  _clientCode,
  _currentMotionData,
  _currentOrientationData,
  _isCodeRunning,
  _isSensorReady,
  _messageApi,
  _printedLog,
  _themeName,
  _workerStatus,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "@/_recoil/client";
import { Typography, theme } from "antd";
import { useEffect, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDarkReasonable as atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

const serverEndpoint = "/backend/save-data";
const workerURL = "/client-worker.js";

function decodeB64Bytes(base64: string): string {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes.buffer);
}

export default function ClientCodeRunner() {
  const [isCodeRunning, setIsCodeRunning] = useRecoilState(_isCodeRunning);
  const clientCode = useRecoilValue(_clientCode);
  const isSensorReady = useRecoilValue(_isSensorReady);
  const currentMotionData = useRecoilValue(_currentMotionData);
  const currentOrientationData = useRecoilValue(_currentOrientationData);
  const messageApi = useRecoilValue(_messageApi);
  const themeName = useRecoilValue(_themeName);
  const [printedLog, setPrintedLog] = useRecoilState(_printedLog);
  const setWorkerStatus = useSetRecoilState(_workerStatus);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const sensorDataRef = useRef<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const logRef = useRef<HTMLDivElement>(null);

  const {
    token: { colorBorder, borderRadius },
  } = theme.useToken();

  useEffect(() => {
    if (isSensorReady) {
      sensorDataRef.current = [
        currentMotionData[0],
        currentMotionData[1],
        currentMotionData[2],
        currentMotionData[3],
        currentMotionData[4],
        currentMotionData[5],
        currentMotionData[6], // alpha speed (deg / s) = z speed
        currentMotionData[7], // beta speed (deg / s) = x speed
        currentMotionData[8], // gamma speed (deg / s) = y speed
        currentOrientationData[6], // alpha (deg) = z
        currentOrientationData[7], // beta (deg) = x
        currentOrientationData[9], // gamma (deg) = y
        currentMotionData[9],
      ];
    } else {
      sensorDataRef.current = [
        -10000, -10000, -10000, -10000, -10000, -10000, -10000, -10000, -10000,
        -10000, -10000, -10000, -10000,
      ];
    }
  }, [isSensorReady, currentMotionData, currentOrientationData]);

  useEffect(() => {
    if (isCodeRunning) {
      const indentedClientCode = "    " + clientCode.split("\n").join("\n    ");
      const finalClientCode =
        clientWrapperCodePre + indentedClientCode + clientWrapperCodePost;

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
          return finalClientCode;
        },
        get_data: () => {
          return sensorDataRef.current;
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
        send: (data: string[][]) => {
          const req: SaveDataRequest = [];
          for (const [b64_name, b64_msg] of data) {
            const name = decodeB64Bytes(b64_name);
            const msgRaw = decodeB64Bytes(b64_msg);
            const msg = JSON.parse(msgRaw);
            const reqPartial = {
              name,
              data: msg,
            };
            req.push(reqPartial);
          }
          if (req.length === 0) {
            return;
          }
          console.log("send[from-py]", req);
          fetch(serverEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
          })
            .then((res) => {
              if (res.status !== 200) {
                console.error("Failed to send data to server", res);
                messageApi?.error("데이터 전송 실패");
              }
              return res.json();
            })
            .then((res: FaleGreenResponse | FaleRedResponse) => {
              if (res.code !== "green") {
                console.error(
                  "Failed to send data to server [json success]",
                  res
                );
                messageApi?.error("데이터 전송 실패");
              }
            })
            .catch((err) => {
              console.error("Failed to send data to server [json fail]", err);
              messageApi?.error("데이터 전송 실패");
            });
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
    clientCode,
    setPrintedLog,
    messageApi,
    setIsCodeRunning,
    setWorkerStatus,
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
          marginTop: 16,
        }}
      >
        <SyntaxHighlighter
          language="text"
          style={themeName === "dark" ? atomOneDark : atomOneLight}
          showLineNumbers
          customStyle={{
            fontFamily: "'Fira Mono', monospace",
            maxHeight: "20vh",
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
