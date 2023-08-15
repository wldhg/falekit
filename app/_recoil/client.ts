import { atom } from "recoil";

export * from "./root";

export const _currentSensorData = atom<number[]>({
  key: "currentSensorData",
  default: [0, 0, 0, 0, 0, 0, 0],
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
