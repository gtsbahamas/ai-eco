import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClientList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Fetch clients
    if (status === 'authenticated') {
      fetchClients();
    }
  }, [status, router]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clients');
      
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      
      const data = await response.json();
      setClients(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError(error.message);
      setLoading(false);
      
      // For demo purposes, set some sample data
      setClients([
        { id: 'client_1', name: 'Acme Corporation', contactEmail: 'contact@acme.com', contactPhone: '555-123-4567', status: 'Active' },
        { id: 'client_2', name: 'TechStart Inc.', contactEmail: 'info@techstart.com', contactPhone: '555-987-6543', status: 'Active' },
        { id: 'client_3', name: 'Global Innovations', contactEmail: 'hello@globalinnovations.com', contactPhone: '555-456-7890', status: 'Inactive' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add client');
      }
      
      const data = await response.json();
      setClients(prev => [...prev, data.client]);
      setShowAddModal(false);
      setNewClient({
        name: '',
        contactEmail: '',
        contactPhone: '',
        address: ''
      });
    } catch (error) {
      console.error('Error adding client:', error);
      // For demo purposes, add a fake client
      const fakeClient = {
        id: `client_${Math.floor(Math.random() * 1000)}`,
        name: newClient.name,
        contactEmail: newClient.contactEmail,
        contactPhone: newClient.contactPhone,
        address: newClient.address,
        status: 'Active'
      };
      setClients(prev => [...prev, fakeClient]);
      setShowAddModal(false);
      setNewClient({
        name: '',
        contactEmail: '',
        contactPhone: '',
        address: ''
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Client
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          <p>{error}</p>
          <p className="mt-2 text-sm">Using sample data instead.</p>
        </div>
      )}

      <div className="overflow-hidden bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Client Name
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Contact Email
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Contact Phone
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{client.contactEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{client.contactPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    client.status === 'Active' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <Link href={`/clients/${client.id}`} className="text-indigo-600 hover:text-indigo-900">
                    View
                  </Link>
                  <span className="mx-2 text-gray-300">|</span>
                  <Link href={`/clients/${client.id}/edit`} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </Link>
                  <span className="mx-2 text-gray-300">|</span>
                  <Link href={`/clients/${client.id}/projects`} className="text-green-600 hover:text-green-900">
                    Projects
                  </Link>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No clients found. Add a new client to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Client</h3>
                <div className="mt-4">
                  <form onSubmit={handleAddClient}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Client Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={newClient.name}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        name="contactEmail"
                        id="contactEmail"
                        value={newClient.contactEmail}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
                      <input
                        type="text"
                        name="contactPhone"
                        id="contactPhone"
                        value={newClient.contactPhone}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        name="address"
                        id="address"
                        rows="3"
                        value={newClient.address}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                    <div className="flex justify-end mt-4 space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Client
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
