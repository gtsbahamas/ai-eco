import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import WithAuth from '@/components/auth/WithAuth';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn()
  }),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }) => children,
  useSession: vi.fn()
}));

describe('WithAuth Component', () => {
  it('renders loading state when session is loading', () => {
    // Mock session loading
    useSession.mockReturnValue({
      data: null,
      status: 'loading'
    });
    
    render(
      <WithAuth>
        <div>Protected Content</div>
      </WithAuth>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Mock unauthenticated session
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });
    
    const mockRouter = { push: vi.fn() };
    useRouter.mockReturnValue(mockRouter);
    
    render(
      <WithAuth>
        <div>Protected Content</div>
      </WithAuth>
    );
    
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated with required role', () => {
    // Mock authenticated session with admin role
    useSession.mockReturnValue({
      data: {
        user: {
          name: 'Admin User',
          role: 'admin'
        }
      },
      status: 'authenticated'
    });
    
    render(
      <WithAuth requiredRole="admin">
        <div>Admin Content</div>
      </WithAuth>
    );
    
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('redirects to unauthorized page when user does not have required role', () => {
    // Mock authenticated session with user role
    useSession.mockReturnValue({
      data: {
        user: {
          name: 'Regular User',
          role: 'user'
        }
      },
      status: 'authenticated'
    });
    
    const mockRouter = { push: vi.fn() };
    useRouter.mockReturnValue(mockRouter);
    
    render(
      <WithAuth requiredRole="admin">
        <div>Admin Content</div>
      </WithAuth>
    );
    
    expect(mockRouter.push).toHaveBeenCalledWith('/unauthorized');
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('allows access when user role is higher than required role', () => {
    // Mock authenticated session with admin role
    useSession.mockReturnValue({
      data: {
        user: {
          name: 'Admin User',
          role: 'admin'
        }
      },
      status: 'authenticated'
    });
    
    render(
      <WithAuth requiredRole="user">
        <div>User Content</div>
      </WithAuth>
    );
    
    expect(screen.getByText('User Content')).toBeInTheDocument();
  });

  it('uses custom redirect path when provided', () => {
    // Mock unauthenticated session
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });
    
    const mockRouter = { push: vi.fn() };
    useRouter.mockReturnValue(mockRouter);
    
    render(
      <WithAuth redirectTo="/custom-login">
        <div>Protected Content</div>
      </WithAuth>
    );
    
    expect(mockRouter.push).toHaveBeenCalledWith('/custom-login');
  });
});
