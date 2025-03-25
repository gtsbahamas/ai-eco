import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type RoleLevel = 'admin' | 'manager' | 'client' | 'user';

const roleHierarchy: Record<RoleLevel, number> = {
  'admin': 3,
  'manager': 2,
  'client': 1,
  'user': 0
};

interface WithAuthProps {
  requiredRole?: RoleLevel;
  children: React.ReactNode;
  redirectTo?: string;
}

export default function WithAuth({ 
  requiredRole = 'user', 
  children, 
  redirectTo = '/auth/login' 
}: WithAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push(redirectTo);
      return;
    }

    // If the session is still loading, do nothing yet
    if (status === 'loading') {
      return;
    }

    // If the user is authenticated but doesn't have the required role
    if (session && session.user) {
      const userRole = session.user.role as RoleLevel || 'user';
      const userRoleLevel = roleHierarchy[userRole] || 0;
      const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

      if (userRoleLevel < requiredRoleLevel) {
        router.push('/unauthorized');
      }
    }
  }, [session, status, requiredRole, router, redirectTo]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  // If authenticated but checking role, show loading
  if (session && session.user) {
    const userRole = session.user.role as RoleLevel || 'user';
    const userRoleLevel = roleHierarchy[userRole] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return null; // Will redirect to unauthorized page
    }
  }

  // If authenticated and has required role, render children
  return <>{children}</>;
}
