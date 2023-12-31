import { atom } from "recoil";

export * from "./root";

export const _currentMotionData = atom<number[]>({
  key: "currentMotionData",
  default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
});

export const _currentMotionDataNRT = atom<number[]>({
  key: "currentMotionDataNRT",
  default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
});

export const _currentOrientationData = atom<number[]>({
  key: "currentOrientationData",
  default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
});

export const _isSensorReady = atom<boolean>({
  key: "isSensorReady",
  default: false,
});

export const _clientCode = atom<string>({
  key: "clientCode",
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

export const _resetRotAccum = atom<boolean>({
  key: "resetRotAccum",
  default: false,
});
