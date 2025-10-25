import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sea Strike - 段ボール海戦ゲーム",
  description: "猫vs犬の段ボール海戦ゲーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
