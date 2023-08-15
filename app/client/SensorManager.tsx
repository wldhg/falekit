"use client";

import {
  _currentSensorData,
  _isSensorReady,
  useSetRecoilState,
} from "@/_recoil/client";
import { message } from "antd";
import { useEffect } from "react";

export default function SensorManager() {
  const setIsSensorReady = useSetRecoilState(_isSensorReady);
  const setCurrentSensorData = useSetRecoilState(_currentSensorData);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const isPermissionRequestRequired =
      window.DeviceOrientationEvent !== undefined && // @ts-ignore-next-line
      typeof window.DeviceOrientationEvent.requestPermission === "function";

    const dmhandler = (e: DeviceMotionEvent) => {
      let x = -100;
      let y = -100;
      let z = -100;
      let alpha = -100;
      let beta = -100;
      let gamma = -100;

      if (e.acceleration !== null) {
        if (e.acceleration.x !== null) {
          x = e.acceleration.x;
        }
        if (e.acceleration.y !== null) {
          y = e.acceleration.y;
        }
        if (e.acceleration.z !== null) {
          z = e.acceleration.z;
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

      setCurrentSensorData([x, y, z, alpha, beta, gamma, e.timeStamp]);
    };

    const requestPermissionSafari = () => {
      if (isPermissionRequestRequired) {
        // @ts-ignore-next-line
        window.DeviceMotionEvent.requestPermission()
          .then((state: string) => {
            if (state === "granted") {
              window.addEventListener("devicemotion", dmhandler);
              setIsSensorReady(true);
              messageApi.success("센서 준비됨");
            } else {
              messageApi.error(`센서 권한 취득 실패 (S: ${state})`);
            }
          })
          .catch((e: any) => {
            console.error(e);
            messageApi.error(`센서 권한 취득 실패 (C: ${e?.message})`);
          });
      } else {
        window.addEventListener("devicemotion", dmhandler);
        setIsSensorReady(true);
        messageApi.success("센서 준비됨");
      }
    };

    requestPermissionSafari();

    return () => {
      window.removeEventListener("devicemotion", dmhandler);
    };
  }, [setIsSensorReady, setCurrentSensorData, messageApi]);

  return <>{contextHolder}</>;
}
