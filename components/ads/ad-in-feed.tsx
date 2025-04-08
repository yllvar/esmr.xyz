"use client"

import { useEffect, useRef } from "react"

interface AdInFeedProps {
  slot: string
  index: number
  className?: string
}

export function AdInFeed({ slot, index, className = "" }: AdInFeedProps) {
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

  return (
    <div className={`my-4 ${className}`} ref={adRef}>
      {/* This is a placeholder for development - replace with actual AdSense code in production */}
      {process.env.NODE_ENV === "development" ? (
        <div
          className="bg-gray-200 h-[200px] w-full flex items-center justify-center"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #e0e0e0 10px, #e0e0e0 20px)",
          }}
        >
          <span className="text-gray-500 text-sm font-medium">In-Feed Ad #{index}</span>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
          data-ad-client="ca-pub-1271507879820340"
          data-ad-slot={slot}
        />
      )}
    </div>
  )
}
