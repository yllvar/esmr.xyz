import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Excel Smart Model Refinery (ESMR) - AI-Powered Excel Data Cleaning",
  description: "Transform your Excel data with AI-powered cleaning and analysis using advanced language models",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>{/* Meta tags are handled by Next.js metadata */}</head>
      <body className={inter.className}>
        {/* Google AdSense Script */}
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1271507879820340"
          crossOrigin="anonymous"
        />
        {children}
        <Footer />
      </body>
    </html>
  )
}


import './globals.css'