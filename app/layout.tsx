import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import "./globals.css";
const displayFont=Bodoni_Moda({subsets:["latin"],variable:"--font-display"});
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL??"https://di-portfolio06.netlify.app";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:"DI ZHENG — Portfolio 2026",
  description:"DI Zheng design portfolio 2026.",
  openGraph:{title:"DI ZHENG — Portfolio 2026",description:"DI Zheng design portfolio 2026.",type:"website",images:["/og.png"]},
  twitter:{card:"summary_large_image",title:"DI ZHENG — Portfolio 2026",description:"DI Zheng design portfolio 2026.",images:["/og.png"]}
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body className={displayFont.variable}>{children}</body></html>}
