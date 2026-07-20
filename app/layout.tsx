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
    title: "接住我 · 情绪电影伴侣",
    description: "说说你此刻的心情，得到三部真正适合当下的电影，以及关于画面、节奏、人物和故事的推荐理由。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "接住我 · 情绪电影伴侣",
      description: "先理解你的此刻，再推荐一部电影。",
      type: "website",
      url: origin,
      images: [{ url: "/og.png", width: 1800, height: 1005, alt: "接住我情绪电影伴侣" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "接住我 · 情绪电影伴侣",
      description: "先理解你的此刻，再推荐一部电影。",
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
