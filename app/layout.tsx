import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "MOOD REEL · 为此刻的心情，找一部电影",
    description: "说说你此刻的心情，MOOD REEL 从画面、节奏与故事里，为今晚选出三种电影可能。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "MOOD REEL · 为此刻的心情，找一部电影",
      description: "让此刻，遇见一部电影。",
      type: "website",
      url: origin,
      images: [{ url: "/og.png", width: 1800, height: 1005, alt: "MOOD REEL 情绪电影推荐" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "MOOD REEL · 为此刻的心情，找一部电影",
      description: "让此刻，遇见一部电影。",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
