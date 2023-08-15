import type { MessageInstance } from "antd/es/message/interface";
import { atom, AtomEffect } from "recoil";
export * from "recoil";

export const stringLocalStorageEffect: (key: string) => AtomEffect<string> =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const _isMobileLayout = atom<boolean>({
  key: "isMobileLayout",
  default: false,
});

export const _themeName = atom<"light" | "dark">({
  key: "themeName",
  default: "light",
});

export const _isOnRendering = atom<boolean>({
  key: "isOnRendering",
  default: true,
});

export const _messageApi = atom<MessageInstance | null>({
  key: "messageApi",
  default: null,
});
