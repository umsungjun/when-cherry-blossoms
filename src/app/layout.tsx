import type { Metadata } from "next";

import { DevTools } from "@/components/dev/DevTools";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://when-cherry-blossoms.vercel.app"
  ),
  title: {
    default: "벚꽃 언제 필까?",
    template: "%s | 벚꽃 언제 필까?",
  },
  description:
    "벚꽃 언제 피나요? 서울, 부산, 제주 등 전국 16곳 벚꽃 개화 시기와 만개 날짜를 알려드려요. 꽃비 예보, 날씨, 가볼 만한 벚꽃 명소까지 한눈에 확인하세요.",
  keywords: [
    "벚꽃 언제 피나요",
    "벚꽃 언제 필까",
    "벚꽃 개화 시기",
    "벚꽃 개화일",
    "벚꽃 만개",
    "2026 벚꽃",
    "벚꽃 명소",
    "벚꽃 축제",
    "서울 벚꽃",
    "부산 벚꽃",
    "제주 벚꽃",
    "여의도 벚꽃",
    "꽃비 예보",
    "봄 나들이",
    "벚꽃 구경",
    "벚꽃 여행",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "벚꽃 언제 필까?",
    description: "전국 벚꽃 개화 시기 · 만개 날짜 · 꽃비 예보 · 벚꽃 명소 추천",
    locale: "ko_KR",
    type: "website",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "언제 필까?" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "벚꽃 언제 필까?",
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "vyhmrnv3ug");`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </div>
          {process.env.NODE_ENV === "development" && <DevTools />}
        </ThemeProvider>
      </body>
    </html>
  );
}
