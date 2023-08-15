"use client";

import { useCallback, useEffect } from "react";

import { _isMobileLayout, useSetRecoilState } from "@/_recoil/root";

const MobileDetector = () => {
  const setIsMobileLayout = useSetRecoilState(_isMobileLayout);

  const mediaQueryListener = useCallback(
    (e: MediaQueryList) => {
      setIsMobileLayout(e.matches);
    },
    [setIsMobileLayout]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");

    if (mediaQuery.matches) {
      setIsMobileLayout(true);
    }

    // @ts-ignore-next-line
    mediaQuery.addEventListener("change", mediaQueryListener);
    return () => {
      // @ts-ignore-next-line
      mediaQuery.removeEventListener("change", mediaQueryListener);
    };
  }, [setIsMobileLayout, mediaQueryListener]);

  return null;
};

export default MobileDetector;
