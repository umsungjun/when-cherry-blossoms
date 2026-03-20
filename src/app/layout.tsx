import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { DevTools } from "@/components/dev/DevTools";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://when-cherry-blossoms.vercel.app"
  ),
  title: {
    default: "언제 필까? | 2026 벚꽃 개화 예보",
    template: "%s | 언제 필까?",
  },
  description:
    "2026년 대한민국 지역별 벚꽃 개화일, 낙화 위험도, 봄 축제 정보를 한눈에 확인하세요. AI 챗봇이 벚꽃 명소와 방문 타이밍을 추천해드려요.",
  keywords: [
    "벚꽃 언제 필까",
    "벚꽃 개화 시기",
    "2026 벚꽃",
    "벚꽃 명소",
    "낙화 위험도",
    "봄 축제",
  ],
  openGraph: {
    title: "언제 필까? | 2026 벚꽃 개화 예보",
    description: "지역별 벚꽃 개화일 · 낙화 위험도 · 봄 축제 정보",
    locale: "ko_KR",
    type: "website",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "언제 필까?" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "언제 필까? | 2026 벚꽃 개화 예보",
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="flex h-screen flex-col antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex flex-1 min-h-0 flex-col overflow-y-auto">{children}</main>
          <Footer />
          {process.env.NODE_ENV === "development" && <DevTools />}
        </ThemeProvider>
      </body>
    </html>
  );
}
