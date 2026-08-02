import type { Metadata, Viewport } from "next";
import { Baloo_2, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const display = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "爆款文案生成器 | 一键生成小红书种草文案",
  description:
    "输入产品和卖点，一键生成小红书爆款标题、正文和话题标签。种草、干货、测评、情绪、避雷，五种风格随心切换。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FF6B8B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-xhs-cream text-xhs-ink antialiased">
        {children}
      </body>
    </html>
  );
}
