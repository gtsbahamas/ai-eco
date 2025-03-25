import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProjectList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    clientId: '',
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Fetch projects and clients
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects
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
      
      setProjects(projectsData);
      setClients(clientsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setLoading(false);
      
      // For demo purposes, set some sample data
      setProjects([
        { 
          id: 'project_1', 
          clientId: 'client_1', 
          name: 'Website Redesign', 
          description: 'Complete overhaul of corporate website',
          startDate: '2025-01-15',
          endDate: '2025-04-30',
          status: 'In Progress' 
        },
        { 
          id: 'project_2', 
          clientId: 'client_2', 
          name: 'Mobile App Development', 
          description: 'iOS and Android app for customer engagement',
          startDate: '2025-02-01',
          endDate: '2025-07-31',
          status: 'Active' 
        },
        { 
          id: 'project_3', 
          clientId: 'client_1', 
          name: 'SEO Optimization', 
          description: 'Improve search engine rankings',
          startDate: '2025-03-01',
          endDate: '2025-05-31',
          status: 'Planning' 
        }
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
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add project');
      }
      
      const data = await response.json();
      setProjects(prev => [...prev, data.project]);
      setShowAddModal(false);
      setNewProject({
        clientId: '',
        name: '',
        description: '',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      console.error('Error adding project:', error);
      // For demo purposes, add a fake project
      const fakeProject = {
        id: `project_${Math.floor(Math.random() * 1000)}`,
        clientId: newProject.clientId,
        name: newProject.name,
        description: newProject.description,
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        status: 'Active'
      };
      setProjects(prev => [...prev, fakeProject]);
      setShowAddModal(false);
      setNewProject({
        clientId: '',
        name: '',
        description: '',
        startDate: '',
        endDate: ''
      });
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-800 bg-green-100';
      case 'In Progress':
        return 'text-blue-800 bg-blue-100';
      case 'Planning':
        return 'text-yellow-800 bg-yellow-100';
      case 'Completed':
        return 'text-gray-800 bg-gray-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Project Tracking</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Project
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
                Project Name
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Timeline
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
            {projects.map((project) => (
              <tr key={project.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  <div className="text-sm text-gray-500">{project.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getClientName(project.clientId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(project.startDate).toLocaleDateString()} - 
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <Link href={`/projects/${project.id}`} className="text-indigo-600 hover:text-indigo-900">
                    View
                  </Link>
                  <span className="mx-2 text-gray-300">|</span>
                  <Link href={`/projects/${project.id}/edit`} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </Link>
                  <span className="mx-2 text-gray-300">|</span>
                  <Link href={`/projects/${project.id}/tasks`} className="text-green-600 hover:text-green-900">
                    Tasks
                  </Link>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No projects found. Add a new project to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Project</h3>
                <div className="mt-4">
                  <form onSubmit={handleAddProject}>
                    <div className="mb-4">
                      <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client</label>
                      <select
                        id="clientId"
                        name="clientId"
                        required
                        value={newProject.clientId}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={newProject.name}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={newProject.description}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          id="startDate"
                          required
                          value={newProject.startDate}
                          onChange={handleInputChange}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          id="endDate"
                          value={newProject.endDate}
                          onChange={handleInputChange}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
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
                        Add Project
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
