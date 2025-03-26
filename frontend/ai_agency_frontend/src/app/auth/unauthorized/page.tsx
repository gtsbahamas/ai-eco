'use client'

import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
          <p className="mt-2 text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
