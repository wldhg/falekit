import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import StyledComponentRegistry from "./antd";
import "./globals.css";
import theme from "./theme";

export const metadata: Metadata = {
  title: "Fale Redirection",
  description: "Redirecting...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentRegistry>
          <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </StyledComponentRegistry>
      </body>
    </html>
  );
}
