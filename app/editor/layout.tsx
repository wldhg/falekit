import type { Metadata } from "next";
import EditorFrame from "./EditorFrame";

export const metadata: Metadata = {
  title: "Fale Editor",
  description: "Fun & Fun! AIoT Lab Experiment!",
};

export default function ServerMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EditorFrame>{children}</EditorFrame>
    </>
  );
}
