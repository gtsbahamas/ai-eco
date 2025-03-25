import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WithAuth from '@/components/auth/WithAuth';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <WithAuth requiredRole="admin">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage all aspects of the AI Agency Ecosystem</p>
        </header>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {/* User Management */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold">User Management</h2>
            </div>
            <p className="mb-4 text-gray-600">Manage users, roles, and permissions</p>
            <Link href="/admin/users" className="inline-block px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Manage Users
            </Link>
          </div>

          {/* System Settings */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold">System Settings</h2>
            </div>
            <p className="mb-4 text-gray-600">Configure system-wide settings and preferences</p>
            <Link href="/admin/settings" className="inline-block px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700">
              System Settings
            </Link>
          </div>

          {/* Analytics */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
            </div>
            <p className="mb-4 text-gray-600">View system-wide analytics and reports</p>
            <Link href="/admin/analytics" className="inline-block px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
              View Analytics
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Recent System Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start p-3 transition-colors bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="p-2 mr-3 text-blue-500 bg-blue-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-gray-500">John Doe (john@example.com)</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 transition-colors bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="p-2 mr-3 text-purple-500 bg-purple-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">System settings updated</p>
                  <p className="text-sm text-gray-500">Email notification settings changed</p>
                  <p className="text-xs text-gray-400">Yesterday</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 transition-colors bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="p-2 mr-3 text-red-500 bg-red-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">System alert</p>
                  <p className="text-sm text-gray-500">Database backup completed with warnings</p>
                  <p className="text-xs text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                <svg className="w-8 h-8 mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Add New User</span>
              </button>
              
              <button className="flex flex-col items-center p-4 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                <svg className="w-8 h-8 mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Backup System</span>
              </button>
              
              <button className="flex flex-col items-center p-4 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                <svg className="w-8 h-8 mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span>Send Notification</span>
              </button>
              
              <button className="flex flex-col items-center p-4 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                <svg className="w-8 h-8 mb-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>Clear Cache</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </WithAuth>
  );
}
