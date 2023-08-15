import type { Metadata } from "next";
import ServerFrame from "./ServerFrame";

export const metadata: Metadata = {
  title: "Fale Server",
  description: "Fun & Fun! AIoT Lab Experiment!",
};

export default function ServerMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ServerFrame>{children}</ServerFrame>
    </>
  );
}
