import Link from "next/link"

export default function AdsensePrivacyPolicy() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Google AdSense Privacy Policy</h1>

      <div className="prose max-w-none">
        <p>This website uses Google AdSense, a service for including advertisements from Google Inc. ("Google").</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Information Collection</h2>
        <p>
          Google AdSense uses cookies and web beacons (invisible graphics) to collect information about visitors. The
          cookies are stored on your computer and allow an analysis of the use of the website.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Information Usage</h2>
        <p>
          Google uses this information to evaluate your use of the website, to compile reports on website activity, and
          to provide other services related to website activity and internet usage to the website operator.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Data Sharing</h2>
        <p>
          Google will transfer this information to third parties if required by law or if third parties process this
          data on behalf of Google. Under no circumstances will Google combine your IP address with other Google data.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Opt-Out</h2>
        <p>
          You can prevent the installation of cookies by setting your browser software accordingly; however, please note
          that if you do this, you may not be able to use the full functionality of this website.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">More Information</h2>
        <p>
          By using this website, you consent to the processing of data about you by Google in the manner and for the
          purposes set out above. For more information about Google's privacy policy, please visit:{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Google Privacy Policy
          </a>
        </p>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home Page
          </Link>
        </div>
      </div>
    </main>
  )
}
