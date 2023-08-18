"use client";

import {
  _currentMotionData,
  _currentOrientationData,
  _isSensorReady,
  _messageApi,
  _resetRotAccum,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "@/_recoil/client";
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";

export default function SensorManager() {
  const setIsSensorReady = useSetRecoilState(_isSensorReady);
  const setCurrentMotionData = useSetRecoilState(_currentMotionData);
  const setCurrentOrientationData = useSetRecoilState(_currentOrientationData);
  const [resetRotAccum, setResetRotAccum] = useRecoilState(_resetRotAccum);
  const [modalOnClick, setModalOnClick] = useState<null | (() => void)>(null);
  const messageApi = useRecoilValue(_messageApi);

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
  ]);

  return (
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
  );
}
