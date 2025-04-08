import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-600">Page Not Found</h2>
      <p className="mt-2 text-gray-500 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/" className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Return Home
      </Link>
    </div>
  )
}
