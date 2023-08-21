import { clientWrapperCodePost, clientWrapperCodePre } from "@/_misc";
import type {
  FaleGreenResponse,
  FaleRedResponse,
  SaveDataRequest,
} from "@/_proto";
import {
  _clientCode,
  _currentMotionData,
  _currentMotionDataNRT,
  _currentOrientationData,
  _isCodeRunning,
  _isSensorReady,
  _messageApi,
  _printedLog,
  _resetRotAccum,
  _themeName,
  _workerStatus,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "@/_recoil/client";
import { Button, Modal, Typography, theme } from "antd";
import { useEffect, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDarkReasonable as atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

const serverEndpoint = "/backend/store-data";
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
  const currentMotionDataNRT = useRecoilValue(_currentMotionDataNRT);
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
  const setIsSensorReady = useSetRecoilState(_isSensorReady);
  const setCurrentMotionData = useSetRecoilState(_currentMotionData);
  const setCurrentMotionDataNRT = useSetRecoilState(_currentMotionDataNRT);
  const setCurrentOrientationData = useSetRecoilState(_currentOrientationData);
  const [resetRotAccum, setResetRotAccum] = useRecoilState(_resetRotAccum);
  const [modalOnClick, setModalOnClick] = useState<null | (() => void)>(null);
  const motionAccumRef = useRef([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (resetRotAccum) {
      setCurrentOrientationData((prev) => {
        return [
          prev[0],
          prev[1],
          prev[2],
          prev[0],
          prev[1],
          prev[2],
          0,
          0,
          0,
          0,
          0,
          prev[11],
        ];
      });
      setResetRotAccum(false);
    }
  }, [resetRotAccum, setResetRotAccum, setCurrentOrientationData]);

  useEffect(() => {
    const isPermissionRequestRequired =
      window.DeviceOrientationEvent !== undefined && // @ts-ignore-next-line
      typeof window.DeviceOrientationEvent.requestPermission === "function";

    const reranging = (a: number, minbound: number, maxbound: number) => {
      if (a < minbound) {
        return maxbound - ((minbound - a) % (maxbound - minbound));
      } else if (a > maxbound) {
        return minbound + ((a - maxbound) % (maxbound - minbound));
      } else {
        return a;
      }
    };

    const dohandler = (e: DeviceOrientationEvent) => {
      let alpha = -10000;
      let beta = -10000;
      let gamma = -10000;

      if (e.alpha !== null) {
        alpha = e.alpha;
      }
      if (e.beta !== null) {
        beta = e.beta;
      }
      if (e.gamma !== null) {
        gamma = e.gamma;
      }

      setCurrentOrientationData((prev) => {
        const prevGammaNotExtended = prev[8];
        const newGammaNotExtended = reranging(gamma - prev[5], -90, 90);
        const prevGammaFlipped = prev[10];
        let gammaFlipped = prevGammaFlipped;
        if (
          prevGammaNotExtended * newGammaNotExtended < 0 &&
          Math.abs(prevGammaNotExtended) > 45
        ) {
          gammaFlipped = gammaFlipped === 1 ? 0 : 1;
        }
        let fixedGamma = newGammaNotExtended;
        if (gammaFlipped === 1) {
          if (newGammaNotExtended > 0) {
            fixedGamma = -180 + newGammaNotExtended;
          } else {
            fixedGamma = 180 + newGammaNotExtended;
          }
        }
        let newAlpha = reranging(alpha - prev[3], 0, 360);
        if (newAlpha > 180) {
          newAlpha = 360 - newAlpha;
        } else {
          newAlpha = -newAlpha;
        }
        return [
          alpha,
          beta,
          gamma,
          prev[3],
          prev[4],
          prev[5],
          newAlpha,
          reranging(beta - prev[4], -180, 180),
          newGammaNotExtended,
          fixedGamma,
          gammaFlipped,
          e.timeStamp,
        ];
      });
    };

    const dmhandler = (e: DeviceMotionEvent) => {
      let x = -10000;
      let y = -10000;
      let z = -10000;
      let xng = -10000;
      let yng = -10000;
      let zng = -10000;
      let alpha = -10000;
      let beta = -10000;
      let gamma = -10000;

      if (e.accelerationIncludingGravity !== null) {
        if (e.accelerationIncludingGravity.x !== null) {
          x = e.accelerationIncludingGravity.x;
        }
        if (e.accelerationIncludingGravity.y !== null) {
          y = e.accelerationIncludingGravity.y;
        }
        if (e.accelerationIncludingGravity.z !== null) {
          z = e.accelerationIncludingGravity.z;
        }
      }

      if (e.acceleration !== null) {
        if (e.acceleration.x !== null) {
          xng = e.acceleration.x;
        }
        if (e.acceleration.y !== null) {
          yng = e.acceleration.y;
        }
        if (e.acceleration.z !== null) {
          zng = e.acceleration.z;
        }
      }

      if (e.rotationRate !== null) {
        if (e.rotationRate.alpha !== null) {
          alpha = e.rotationRate.alpha;
        }
        if (e.rotationRate.beta !== null) {
          beta = e.rotationRate.beta;
        }
        if (e.rotationRate.gamma !== null) {
          gamma = e.rotationRate.gamma;
        }
      }

      motionAccumRef.current[0] += x;
      motionAccumRef.current[1] += y;
      motionAccumRef.current[2] += z;
      motionAccumRef.current[3] += xng;
      motionAccumRef.current[4] += yng;
      motionAccumRef.current[5] += zng;
      motionAccumRef.current[6] += alpha;
      motionAccumRef.current[7] += beta;
      motionAccumRef.current[8] += gamma;
      motionAccumRef.current[9] += 1;

      const count = Math.max(motionAccumRef.current[9], 1);

      const avg_x = motionAccumRef.current[0] / count;
      const avg_y = motionAccumRef.current[1] / count;
      const avg_z = motionAccumRef.current[2] / count;
      const avg_xng = motionAccumRef.current[3] / count;
      const avg_yng = motionAccumRef.current[4] / count;
      const avg_zng = motionAccumRef.current[5] / count;
      const avg_alpha = motionAccumRef.current[6] / count;
      const avg_beta = motionAccumRef.current[7] / count;
      const avg_gamma = motionAccumRef.current[8] / count;

      setCurrentMotionData([
        x,
        y,
        z,
        xng,
        yng,
        zng,
        alpha,
        beta,
        gamma,
        e.timeStamp,
      ]);

      setCurrentMotionDataNRT([
        avg_x,
        avg_y,
        avg_z,
        avg_xng,
        avg_yng,
        avg_zng,
        avg_alpha,
        avg_beta,
        avg_gamma,
        e.timeStamp,
      ]);
    };

    const requestPermissionSafari = () => {
      if (isPermissionRequestRequired) {
        // @ts-ignore-next-line
        return window.DeviceMotionEvent.requestPermission()
          .then((state: string) => {
            if (state === "granted") {
              window.addEventListener("devicemotion", dmhandler);
              window.addEventListener("deviceorientation", dohandler);
              setIsSensorReady(true);
              messageApi?.success("센서 준비됨");
            } else {
              messageApi?.error(`센서 권한 취득 실패 (S: ${state})`);
            }
          })
          .catch((e: any) => {
            console.error(e);
            messageApi?.error(`센서 권한 취득 실패 (C: ${e?.message})`);
          });
      } else {
        return new Promise((resolve) => {
          window.addEventListener("devicemotion", dmhandler);
          window.addEventListener("deviceorientation", dohandler);
          setIsSensorReady(true);
          messageApi?.success("센서 준비됨");
          resolve(null);
        });
      }
    };

    if (isPermissionRequestRequired) {
      setModalOnClick(() => () => {
        requestPermissionSafari().then(() => {
          setModalOnClick(null);
        });
      });
    } else {
      requestPermissionSafari();
    }

    return () => {
      window.removeEventListener("devicemotion", dmhandler);
    };
  }, [
    setIsSensorReady,
    setCurrentMotionData,
    messageApi,
    setCurrentOrientationData,
    setCurrentMotionDataNRT,
  ]);

  useEffect(() => {
    if (isSensorReady) {
      sensorDataRef.current = [
        currentMotionDataNRT[0],
        currentMotionDataNRT[1],
        currentMotionDataNRT[2],
        currentMotionDataNRT[3],
        currentMotionDataNRT[4],
        currentMotionDataNRT[5],
        currentMotionDataNRT[6], // alpha speed (deg / s) = z speed
        currentMotionDataNRT[7], // beta speed (deg / s) = x speed
        currentMotionDataNRT[8], // gamma speed (deg / s) = y speed
        currentOrientationData[6], // alpha (deg) = z
        currentOrientationData[7], // beta (deg) = x
        currentOrientationData[9], // gamma (deg) = y
        currentMotionDataNRT[9],
      ];
    } else {
      sensorDataRef.current = [
        -10000, -10000, -10000, -10000, -10000, -10000, -10000, -10000, -10000,
        -10000, -10000, -10000, -10000,
      ];
    }
  }, [isSensorReady, currentMotionDataNRT, currentOrientationData]);

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
          const sensorData = JSON.parse(JSON.stringify(sensorDataRef.current));
          motionAccumRef.current = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          return sensorData;
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
      <Modal
        title="모션 센서 권한 요청"
        open={modalOnClick !== null}
        maskClosable={false}
        keyboard={false}
        closeIcon={false}
        footer={
          <Button type="primary" onClick={modalOnClick || (() => {})}>
            수락
          </Button>
        }
      >
        <p>이 디바이스에서 센서 데이터를 얻고자 합니다.</p>
        <p>
          수집된 센서 데이터는 교육 진행을 위해 Falekit 실행 데스크톱으로만 전송
          및 저장되며, 다른 용도의 전송 혹은 사용은 발생하지 않습니다.
        </p>
      </Modal>
      <Typography.Text strong>
        실행 로그 <Typography.Text code>print()</Typography.Text>
      </Typography.Text>
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
