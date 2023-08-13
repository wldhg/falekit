import { PyodideInterface } from "pyodide";
import { atom, AtomEffect } from "recoil";

const stringLocalStorageEffect: (key: string) => AtomEffect<string> =
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

export const _serverCode = atom<string>({
  key: "serverCode",
  default: "",
  effects: [stringLocalStorageEffect("serverCode")],
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
