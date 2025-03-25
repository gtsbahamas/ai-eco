import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock next-auth/react signIn function
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }) => children,
  signIn: vi.fn(),
  useSession: vi.fn().mockReturnValue({
    data: null,
    status: 'unauthenticated'
  })
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup router mock
    const mockRouter = { push: vi.fn() };
    useRouter.mockReturnValue(mockRouter);
  });

  it('renders the login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginForm />);
    
    // Submit form without filling in fields
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('calls signIn with credentials when form is submitted', async () => {
    render(<LoginForm />);
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Check if signIn was called with correct parameters
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false
      });
    });
  });

  it('calls signIn with google provider when Google button is clicked', async () => {
    render(<LoginForm />);
    
    // Click Google sign in button
    fireEvent.click(screen.getByText(/Sign in with Google/i));
    
    // Check if signIn was called with correct parameters
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });
    });
  });

  it('shows error message when login fails', async () => {
    // Mock signIn to return error
    signIn.mockResolvedValueOnce({
      error: 'Invalid credentials',
      ok: false,
      status: 401
    });
    
    render(<LoginForm />);
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('redirects to dashboard on successful login', async () => {
    // Mock signIn to return success
    signIn.mockResolvedValueOnce({
      error: null,
      ok: true,
      status: 200
    });
    
    const mockRouter = { push: vi.fn() };
    useRouter.mockReturnValue(mockRouter);
    
    render(<LoginForm />);
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Check if router.push was called with dashboard path
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
