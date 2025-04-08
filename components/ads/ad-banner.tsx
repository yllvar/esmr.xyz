"use client"

import { useEffect, useRef } from "react"

interface AdBannerProps {
  slot: string
  format?: "auto" | "horizontal" | "vertical" | "rectangle"
  responsive?: boolean
  className?: string
}

export function AdBanner({ slot, format = "auto", responsive = true, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simple AdSense initialization
    if (typeof window !== "undefined" && adRef.current) {
      try {
        // @ts-ignore - AdSense is added by the script in layout.tsx
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error("AdSense error:", error)
      }
    }
  }, [])

  // Set the appropriate class based on the format
  const formatClass =
    format === "horizontal"
      ? "h-[90px] w-full"
      : format === "vertical"
        ? "h-[600px] w-[160px]"
        : format === "rectangle"
          ? "h-[250px] w-[300px]"
          : "h-[250px] w-full"

  return (
    <div className={`overflow-hidden ${responsive ? "mx-auto" : ""} ${className}`} ref={adRef}>
      {/* This is a placeholder for development - replace with actual AdSense code in production */}
      {process.env.NODE_ENV === "development" ? (
        <div
          className={`bg-gray-200 flex items-center justify-center ${formatClass}`}
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #e0e0e0 10px, #e0e0e0 20px)",
          }}
        >
          <span className="text-gray-500 text-sm font-medium">AdSense Banner ({format})</span>
        </div>
      ) : (
        <ins
          className={`adsbygoogle ${formatClass}`}
          style={{ display: "block" }}
          data-ad-client="ca-pub-1271507879820340"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      )}
    </div>
  )
}
