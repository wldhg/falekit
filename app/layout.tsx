import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import StyledComponentRegistry from "./antd";
import "./globals.css";
import theme from "./theme";
import Wrapper from "./wrapper";

export const metadata: Metadata = {
  title: "Fale",
  description: "Fun & Fun! AIoT Lab Experiment!",
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
          <ConfigProvider theme={theme}>
            <Wrapper>{children}</Wrapper>
          </ConfigProvider>
        </StyledComponentRegistry>
      </body>
    </html>
  );
}
