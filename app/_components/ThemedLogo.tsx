import { _themeName, useRecoilValue } from "@/_recoil/root";
import Image from "next/image";
import { CSSProperties } from "react";

export default function ThemedLogo(props: {
  fixedTo?: "dark" | "light";
  style?: CSSProperties | undefined;
}) {
  const themeName = useRecoilValue(_themeName);
  const style = props.style ?? {};
  const isDarkApplied = props.fixedTo
    ? props.fixedTo === "dark"
    : themeName !== "dark";

  return (
    <Image
      src={isDarkApplied ? "/fale_black.svg" : "/fale_white.svg"}
      alt="Fale Logo"
      fill
      style={style}
    ></Image>
  );
}
