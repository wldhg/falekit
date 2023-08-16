import { atom } from "recoil";

export * from "./root";

export const _serverCodeOnMonitor = atom<string>({
  key: "serverCodeOnMonitor",
  default: "",
});

export const _lastTimeCodeLoaded = atom<number>({
  key: "lastTimeCodeLoaded",
  default: 0,
});

export const _isCodeRunning = atom<boolean>({
  key: "isCodeRunning",
  default: false,
});

export const _printedLog = atom<string[]>({
  key: "printedLog",
  default: [],
});

export const _workerStatus = atom<string>({
  key: "workerStatus",
  default: "워커 대기 중",
});

interface ServerMonitorData {
  [key: string]:
    | number
    | {
        x: number[];
        y: number[];
      }
    | string
    | boolean;
}

export const _serverMonitorData = atom<ServerMonitorData>({
  key: "serverMonitorData",
  default: {},
});

interface ServerActuatorData {
  [key: string]:
    | {
        type: "led";
        color: string;
      }
    | {
        type: "servo";
        angle: number;
      }
    | {
        type: "buzzer";
        status: "on" | "off";
        frequency: number;
      }
    | {
        type: "motor";
        rpm: number;
      }
    | {
        type: "vibrator";
        duration: number;
      };
}

export const _serverActuatorData = atom<ServerActuatorData>({
  key: "serverActuatorData",
  default: {},
});
