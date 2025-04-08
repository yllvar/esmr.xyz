import Link from "next/link"

export default function TermsOfService() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose max-w-none">
        <p>
          Welcome to Excel Preprocessor. By accessing or using our service, you agree to be bound by these Terms of
          Service.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using our service, you agree to these Terms of Service and our Privacy Policy. If you do not
          agree to these terms, please do not use our service.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Description of Service</h2>
        <p>
          Excel Preprocessor provides tools for cleaning and processing Excel files using AI models. We reserve the
          right to modify, suspend, or discontinue the service at any time without notice.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. User Responsibilities</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account information and for all activities
          that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Data Privacy</h2>
        <p>
          We collect and process data in accordance with our Privacy Policy. By using our service, you consent to such
          processing and you warrant that all data provided by you is accurate.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Intellectual Property</h2>
        <p>
          All content included on this website, such as text, graphics, logos, and software, is the property of Excel
          Preprocessor or its content suppliers and protected by copyright laws.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Limitation of Liability</h2>
        <p>
          In no event shall Excel Preprocessor be liable for any indirect, incidental, special, consequential or
          punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
          losses.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will provide notice of any material changes by
          posting the new Terms of Service on this site.
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
