import { _themeName, useRecoilValue } from "@/_recoil/root";
import Image from "next/image";
import { CSSProperties } from "react";

export default function ThemedLogo(props: {
  style?: CSSProperties | undefined;
}) {
  const themeName = useRecoilValue(_themeName);
  const style = props.style ?? {};

  return (
    <Image
      src={themeName === "dark" ? "/fale_white.svg" : "/fale_black.svg"}
      alt="Fale Logo"
      fill
      style={style}
    ></Image>
  );
}
