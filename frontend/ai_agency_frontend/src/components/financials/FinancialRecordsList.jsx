import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FinancialRecordsList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [financialRecords, setFinancialRecords] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    projectId: '',
    clientId: '',
    type: 'Revenue',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Fetch data
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch financial records
      const recordsResponse = await fetch('/api/financials');
      if (!recordsResponse.ok) {
        throw new Error('Failed to fetch financial records');
      }
      const recordsData = await recordsResponse.json();
      
      // Fetch projects for dropdown
      const projectsResponse = await fetch('/api/projects');
      if (!projectsResponse.ok) {
        throw new Error('Failed to fetch projects');
      }
      const projectsData = await projectsResponse.json();
      
      // Fetch clients for dropdown
      const clientsResponse = await fetch('/api/clients');
      if (!clientsResponse.ok) {
        throw new Error('Failed to fetch clients');
      }
      const clientsData = await clientsResponse.json();
      
      setFinancialRecords(recordsData);
      setProjects(projectsData);
      setClients(clientsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setLoading(false);
      
      // For demo purposes, set some sample data
      setFinancialRecords([
        { 
          id: 'financial_1', 
          projectId: 'project_1', 
          clientId: 'client_1', 
          type: 'Revenue', 
          amount: 15000, 
          description: 'Initial payment for website redesign',
          date: '2025-01-15',
          project: { name: 'Website Redesign' },
          client: { name: 'Acme Corporation' }
        },
        { 
          id: 'financial_2', 
          projectId: 'project_2', 
          clientId: 'client_2', 
          type: 'Revenue', 
          amount: 25000, 
          description: 'First milestone payment for mobile app',
          date: '2025-02-10',
          project: { name: 'Mobile App Development' },
          client: { name: 'TechStart Inc.' }
        },
        { 
          id: 'financial_3', 
          projectId: 'project_1', 
          clientId: null, 
          type: 'Expense', 
          amount: 5000, 
          description: 'Design contractor fees',
          date: '2025-01-25',
          project: { name: 'Website Redesign' },
          client: null
        }
      ]);
      
      setProjects([
        { id: 'project_1', name: 'Website Redesign', clientId: 'client_1' },
        { id: 'project_2', name: 'Mobile App Development', clientId: 'client_2' },
        { id: 'project_3', name: 'SEO Optimization', clientId: 'client_1' }
      ]);
      
      setClients([
        { id: 'client_1', name: 'Acme Corporation' },
        { id: 'client_2', name: 'TechStart Inc.' },
        { id: 'client_3', name: 'Global Innovations' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/financials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add financial record');
      }
      
      const data = await response.json();
      
      // Add project and client details to the new record for display
      const project = projects.find(p => p.id === newRecord.projectId);
      const client = clients.find(c => c.id === newRecord.clientId);
      
      const newRecordWithDetails = {
        ...data.record,
        project: project ? { name: project.name } : null,
        client: client ? { name: client.name } : null
      };
      
      setFinancialRecords(prev => [...prev, newRecordWithDetails]);
      setShowAddModal(false);
      setNewRecord({
        projectId: '',
        clientId: '',
        type: 'Revenue',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding financial record:', error);
      // For demo purposes, add a fake record
      const project = projects.find(p => p.id === newRecord.projectId);
      const client = clients.find(c => c.id === newRecord.clientId);
      
      const fakeRecord = {
        id: `financial_${Math.floor(Math.random() * 1000)}`,
        projectId: newRecord.projectId,
        clientId: newRecord.clientId,
        type: newRecord.type,
        amount: parseFloat(newRecord.amount),
        description: newRecord.description,
        date: newRecord.date,
        project: project ? { name: project.name } : null,
        client: client ? { name: client.name } : null
      };
      
      setFinancialRecords(prev => [...prev, fakeRecord]);
      setShowAddModal(false);
      setNewRecord({
        projectId: '',
        clientId: '',
        type: 'Revenue',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTypeClass = (type) => {
    return type === 'Revenue' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading financial records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Financial Record
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          <p>{error}</p>
          <p className="mt-2 text-sm">Using sample data instead.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        {/* Summary Cards */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(
              financialRecords
                .filter(record => record.type === 'Revenue')
                .reduce((sum, record) => sum + record.amount, 0)
            )}
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Total Expenses</h2>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(
              financialRecords
                .filter(record => record.type === 'Expense')
                .reduce((sum, record) => sum + record.amount, 0)
            )}
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Net Profit</h2>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(
              financialRecords.reduce((sum, record) => {
                return record.type === 'Revenue' 
                  ? sum + record.amount 
                  : sum - record.amount;
              }, 0)
            )}
          </p>
        </div>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Project/Client
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {financialRecords.map((record) => (
              <tr key={record.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getTypeClass(record.type)}`}>
                    {record.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${record.type === 'Revenue' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(record.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {record.project && <div>{record.project.name}</div>}
                    {record.client && <div className="text-xs text-gray-500">{record.client.name}</div>}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <Link href={`/financials/${record.id}/edit`} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </Link>
                  <span className="mx-2 text-gray-300">|</span>
                  <button
                    onClick={() => {
                      // In a real app, this would call an API to delete the record
                      setFinancialRecords(prev => prev.filter(r => r.id !== record.id));
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {financialRecords.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No financial records found. Add a new record to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Financial Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Add Financial Record</h3>
                <div className="mt-4">
                  <form onSubmit={handleAddRecord}>
                    <div className="mb-4">
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        id="type"
                        name="type"
                        required
                        value={newRecord.type}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="Revenue">Revenue</option>
                        <option value="Expense">Expense</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="amount"
                          id="amount"
                          required
                          min="0"
                          step="0.01"
                          value={newRecord.amount}
                          onChange={handleInputChange}
                          className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="0.00"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">USD</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        name="description"
                        id="description"
                        required
                        value={newRecord.description}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        value={newRecord.date}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Project (Optional)</label>
                      <select
                        id="projectId"
                        name="projectId"
                        value={newRecord.projectId}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a project</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client (Optional)</label>
                      <select
                        id="clientId"
                        name="clientId"
                        value={newRecord.clientId}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </select>
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
                        Add Record
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
