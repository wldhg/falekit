"use client";

import {
  _currentSensorData,
  _isSensorReady,
  _messageApi,
  _resetRotAccum,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "@/_recoil/client";
import { useEffect } from "react";

export default function SensorManager() {
  const setIsSensorReady = useSetRecoilState(_isSensorReady);
  const setCurrentSensorData = useSetRecoilState(_currentSensorData);
  const [resetRotAccum, setResetRotAccum] = useRecoilState(_resetRotAccum);
  const messageApi = useRecoilValue(_messageApi);

  useEffect(() => {
    if (resetRotAccum) {
      setCurrentSensorData((prev) => {
        return [
          prev[0],
          prev[1],
          prev[2],
          prev[3],
          prev[4],
          prev[5],
          0,
          0,
          0,
          prev[9],
        ];
      });
      setResetRotAccum(false);
    }
  }, [resetRotAccum, setResetRotAccum, setCurrentSensorData]);

  useEffect(() => {
    const isPermissionRequestRequired =
      window.DeviceOrientationEvent !== undefined && // @ts-ignore-next-line
      typeof window.DeviceOrientationEvent.requestPermission === "function";

    const dmhandler = (e: DeviceMotionEvent) => {
      let x = -10000;
      let y = -10000;
      let z = -10000;
      let alpha = -10000;
      let beta = -10000;
      let gamma = -10000;

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

      setCurrentSensorData((prev) => {
        return [
          x,
          y,
          z,
          alpha,
          beta,
          gamma,
          alpha === -10000 ? 0 : prev[6] + alpha,
          beta === -10000 ? 0 : prev[7] + beta,
          gamma === -10000 ? 0 : prev[8] + gamma,
          e.timeStamp,
        ];
      });
    };

    const requestPermissionSafari = () => {
      if (isPermissionRequestRequired) {
        // @ts-ignore-next-line
        window.DeviceMotionEvent.requestPermission()
          .then((state: string) => {
            if (state === "granted") {
              window.addEventListener("devicemotion", dmhandler);
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
        window.addEventListener("devicemotion", dmhandler);
        setIsSensorReady(true);
        messageApi?.success("센서 준비됨");
      }
    };

    requestPermissionSafari();

    return () => {
      window.removeEventListener("devicemotion", dmhandler);
    };
  }, [setIsSensorReady, setCurrentSensorData, messageApi]);

  return null;
}
