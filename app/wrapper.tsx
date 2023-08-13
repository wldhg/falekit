"use client";

import MobileDetector from "@/_components/MobileDetector";
import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import ThemeSaver from "./_components/ThemeSaver";

type ColorScheme = "dark" | "light";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");

  const mediaQueryListener = (e: MediaQueryList) => {
    setColorScheme(e.matches ? "dark" : "light");
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (mediaQuery.matches) {
      setColorScheme("dark");
    } else {
      setColorScheme("light");
    }

    // @ts-ignore-next-line
    mediaQuery.addEventListener("change", mediaQueryListener);
    return () => {
      // @ts-ignore-next-line
      mediaQuery.removeEventListener("change", mediaQueryListener);
    };
  }, []);

  return (
    <RecoilRoot>
      <ConfigProvider
        theme={{
          algorithm:
            colorScheme === "light"
              ? theme.defaultAlgorithm
              : theme.darkAlgorithm,
        }}
      >
        <MobileDetector />
        <ThemeSaver theme={colorScheme} />
        {children}
      </ConfigProvider>
    </RecoilRoot>
  );
};

export default Wrapper;