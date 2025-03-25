import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ClientList from '@/components/clients/ClientList';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn()
  }),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn().mockReturnValue({
    data: {
      user: {
        name: 'Test User',
        role: 'manager'
      }
    },
    status: 'authenticated'
  })
}));

// Setup MSW server to intercept API requests
const server = setupServer(
  rest.get('/api/clients', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 'client_1', name: 'Acme Corporation', contactEmail: 'contact@acme.com', contactPhone: '555-123-4567', status: 'Active' },
        { id: 'client_2', name: 'TechStart Inc.', contactEmail: 'info@techstart.com', contactPhone: '555-987-6543', status: 'Active' },
      ])
    );
  }),
  rest.post('/api/clients', (req, res, ctx) => {
    return res(
      ctx.json({
        client: {
          id: 'client_3',
          name: 'New Test Client',
          contactEmail: 'test@newclient.com',
          contactPhone: '555-555-5555',
          status: 'Active'
        }
      })
    );
  })
);

describe('ClientList Integration Tests', () => {
  // Start server before tests
  beforeAll(() => server.listen());
  
  // Reset handlers after each test
  afterEach(() => server.resetHandlers());
  
  // Close server after all tests
  afterAll(() => server.close());

  it('renders client list with data from API', async () => {
    render(<ClientList />);
    
    // Check loading state first
    expect(screen.getByText('Loading clients...')).toBeInTheDocument();
    
    // Wait for clients to load
    await waitFor(() => {
      expect(screen.getByText('Client Management')).toBeInTheDocument();
    });
    
    // Check if clients are displayed
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('TechStart Inc.')).toBeInTheDocument();
    expect(screen.getByText('contact@acme.com')).toBeInTheDocument();
    expect(screen.getByText('info@techstart.com')).toBeInTheDocument();
  });

  it('opens add client modal when button is clicked', async () => {
    render(<ClientList />);
    
    // Wait for clients to load
    await waitFor(() => {
      expect(screen.getByText('Client Management')).toBeInTheDocument();
    });
    
    // Click add client button
    fireEvent.click(screen.getByText('Add New Client'));
    
    // Check if modal is displayed
    expect(screen.getByText('Add New Client')).toBeInTheDocument();
    expect(screen.getByLabelText('Client Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact Email')).toBeInTheDocument();
  });

  it('adds a new client when form is submitted', async () => {
    render(<ClientList />);
    
    // Wait for clients to load
    await waitFor(() => {
      expect(screen.getByText('Client Management')).toBeInTheDocument();
    });
    
    // Click add client button
    fireEvent.click(screen.getByText('Add New Client'));
    
    // Fill in form
    fireEvent.change(screen.getByLabelText('Client Name'), {
      target: { value: 'New Test Client' }
    });
    
    fireEvent.change(screen.getByLabelText('Contact Email'), {
      target: { value: 'test@newclient.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Contact Phone'), {
      target: { value: '555-555-5555' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Add Client' }));
    
    // Check if new client is added to the list
    await waitFor(() => {
      expect(screen.getByText('New Test Client')).toBeInTheDocument();
      expect(screen.getByText('test@newclient.com')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    // Override the handler to simulate an error
    server.use(
      rest.get('/api/clients', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Internal Server Error' })
        );
      })
    );
    
    render(<ClientList />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Using sample data instead.')).toBeInTheDocument();
    });
  });
});
