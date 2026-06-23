import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Poker League Platform",
  description: "WPK 电竞锦标赛平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-950 text-slate-100">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
