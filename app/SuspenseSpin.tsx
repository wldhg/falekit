"use client";

import { Spin } from "antd";

export default function Suspense() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
      }}
    >
      <Spin size="large" />
    </div>
  );
}
