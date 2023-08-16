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
