"use client";

import { ConfigProvider, theme } from "antd";
import { Suspense, useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import MessageApi from "./MessageApi";
import MobileDetector from "./MobileDetector";
import NavigationEvents from "./NavigationEvents";
import SuspenseSpin from "./SuspenseSpin";
import ThemeSaver from "./ThemeSaver";

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
    <Suspense fallback={<SuspenseSpin />}>
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
          <MessageApi />
          <NavigationEvents />
          {children}
        </ConfigProvider>
      </RecoilRoot>
    </Suspense>
  );
};

export default Wrapper;
