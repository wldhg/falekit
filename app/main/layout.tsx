import type { Metadata } from "next";
import Wrapper from "./wrapper";

export const metadata: Metadata = {
  title: "Fale",
  description: "Fun & Fun! AIoT Lab Experiment!",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Wrapper>{children}</Wrapper>;
}
