import { atom } from "recoil";

export const _isMobileLayout = atom<boolean>({
  key: "isMobileLayout",
  default: false,
});
