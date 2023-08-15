import { PyodideInterface } from "pyodide";
import { atom } from "recoil";
import { stringLocalStorageEffect } from "./root";

export * from "./root";

export const _renderTargetPath = atom<string>({
  key: "renderTargetPath",
  default: "",
});

export const _renderCurrentPath = atom<string>({
  key: "renderCurrentPath",
  default: "",
});

export const _serverCode = atom<string>({
  key: "serverCode",
  default: "",
  effects: [stringLocalStorageEffect("serverCode")],
});

export const _clientCode = atom<string>({
  key: "clientCode",
  default: "",
  effects: [stringLocalStorageEffect("clientCode")],
});

export const _pyodide = atom<PyodideInterface | null>({
  key: "pyodide",
  default: null,
  dangerouslyAllowMutability: true,
});

export const _isPyodideAvailable = atom<boolean>({
  key: "isPyodideAvailable",
  default: false,
});

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
