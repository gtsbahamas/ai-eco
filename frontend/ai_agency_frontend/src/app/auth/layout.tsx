export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            AI Agency Ecosystem
          </h2>
        </div>
        {children}
      </div>
    </div>
  )
}
