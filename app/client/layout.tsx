import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fale Client",
  description: "Fun & Fun! AIoT Lab Experiment!",
};

export default function ClientMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
