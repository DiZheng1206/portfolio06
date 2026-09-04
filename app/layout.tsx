import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://di-creative-portfolio.agile-bow-9238.chatgpt.site"),
  title:"你的名字 — 作品集",
  description:"个人设计、影像与创意作品集。",
  openGraph:{title:"你的名字 — 作品集",description:"个人设计、影像与创意作品集。",type:"website",images:["/og.png"]},
  twitter:{card:"summary_large_image",title:"你的名字 — 作品集",description:"个人设计、影像与创意作品集。",images:["/og.png"]}
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body>{children}</body></html>}
