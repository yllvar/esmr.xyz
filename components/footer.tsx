import Link from "next/link"
import { AdBanner } from "./ads/ad-banner"

export function Footer() {
  return (
    <footer className="bg-gray-100 mt-12 pt-8 pb-4">
      <div className="container mx-auto px-4">
        {/* Footer ad banner */}
        <AdBanner slot="9012345678" format="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Excel Smart Model Refinery</h3>
            <p className="text-gray-600">
              Transform your Excel data with AI-powered cleaning and analysis. ESMR uses advanced language models to
              refine, structure, and extract insights from your spreadsheet data.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/adsense-privacy-policy" className="text-gray-600 hover:text-gray-900">
                  AdSense Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/adsense-privacy-policy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Excel Smart Model Refinery (ESMR). All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
