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

export const _isLeftSiderCollapsed = atom<boolean>({
  key: "isLeftSiderCollapsed",
  default: false,
});

export const _editorHeight = atom<number>({
  key: "editorHeight",
  default: 0,
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
