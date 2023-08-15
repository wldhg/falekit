"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { _isOnRendering, useSetRecoilState } from "./_recoil/root";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setIsOnRendering = useSetRecoilState(_isOnRendering);

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    console.log(`Navigated to ${url}`);
  }, [pathname, searchParams]);

  useEffect(() => {
    setIsOnRendering(false);
  }, [setIsOnRendering]);

  return null;
}
