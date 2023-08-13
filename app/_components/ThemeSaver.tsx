import { _themeName, useSetRecoilState } from "@/_recoil";
import { useEffect } from "react";

export default function ThemeSaver(props: { theme: "light" | "dark" }) {
  const setThemeName = useSetRecoilState(_themeName);

  useEffect(() => {
    setThemeName(props.theme);
  }, [props.theme, setThemeName]);

  return null;
}
