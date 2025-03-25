import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResourceAllocationList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [allocations, setAllocations] = useState([]);
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAllocation, setNewAllocation] = useState({
    resourceId: '',
    projectId: '',
    allocationPercentage: 0,
    startDate: '',
    endDate: ''
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
      
      // Fetch resources
      const resourcesResponse = await fetch('/api/resources');
      if (!resourcesResponse.ok) {
        throw new Error('Failed to fetch resources');
      }
      const resourcesData = await resourcesResponse.json();
      
      // Fetch projects
      const projectsResponse = await fetch('/api/projects');
      if (!projectsResponse.ok) {
        throw new Error('Failed to fetch projects');
      }
      const projectsData = await projectsResponse.json();
      
      // Fetch allocations
      const allocationsResponse = await fetch('/api/resource-allocations');
      if (!allocationsResponse.ok) {
        throw new Error('Failed to fetch allocations');
      }
      const allocationsData = await allocationsResponse.json();
      
      setResources(resourcesData);
      setProjects(projectsData);
      setAllocations(allocationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setLoading(false);
      
      // For demo purposes, set some sample data
      setResources([
        { id: 'resource_1', userId: 'user_1', user: { name: 'John Doe' }, skillSet: 'Frontend Development, UI/UX', availability: 'Available' },
        { id: 'resource_2', userId: 'user_2', user: { name: 'Jane Smith' }, skillSet: 'Backend Development, Database', availability: 'Available' },
        { id: 'resource_3', userId: 'user_3', user: { name: 'Mike Johnson' }, skillSet: 'AI Development, Machine Learning', availability: 'Partially Available' }
      ]);
      
      setProjects([
        { id: 'project_1', name: 'Website Redesign', clientId: 'client_1' },
        { id: 'project_2', name: 'Mobile App Development', clientId: 'client_2' },
        { id: 'project_3', name: 'SEO Optimization', clientId: 'client_1' }
      ]);
      
      setAllocations([
        { 
          id: 'allocation_1', 
          resourceId: 'resource_1', 
          projectId: 'project_1', 
          allocationPercentage: 50,
          startDate: '2025-01-15',
          endDate: '2025-04-30',
          resource: { user: { name: 'John Doe' } },
          project: { name: 'Website Redesign' }
        },
        { 
          id: 'allocation_2', 
          resourceId: 'resource_2', 
          projectId: 'project_2', 
          allocationPercentage: 75,
          startDate: '2025-02-01',
          endDate: '2025-07-31',
          resource: { user: { name: 'Jane Smith' } },
          project: { name: 'Mobile App Development' }
        }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAllocation(prev => ({ 
      ...prev, 
      [name]: name === 'allocationPercentage' ? parseInt(value, 10) : value 
    }));
  };

  const handleAddAllocation = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/resource-allocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAllocation),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add allocation');
      }
      
      const data = await response.json();
      
      // Add resource and project details to the new allocation for display
      const resource = resources.find(r => r.id === newAllocation.resourceId);
      const project = projects.find(p => p.id === newAllocation.projectId);
      
      const newAllocationWithDetails = {
        ...data.allocation,
        resource: { user: { name: resource.user.name } },
        project: { name: project.name }
      };
      
      setAllocations(prev => [...prev, newAllocationWithDetails]);
      setShowAddModal(false);
      setNewAllocation({
        resourceId: '',
        projectId: '',
        allocationPercentage: 0,
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      console.error('Error adding allocation:', error);
      // For demo purposes, add a fake allocation
      const resource = resources.find(r => r.id === newAllocation.resourceId);
      const project = projects.find(p => p.id === newAllocation.projectId);
      
      const fakeAllocation = {
        id: `allocation_${Math.floor(Math.random() * 1000)}`,
        resourceId: newAllocation.resourceId,
        projectId: newAllocation.projectId,
        allocationPercentage: newAllocation.allocationPercentage,
        startDate: newAllocation.startDate,
        endDate: newAllocation.endDate,
        resource: { user: { name: resource.user.name } },
        project: { name: project.name }
      };
      
      setAllocations(prev => [...prev, fakeAllocation]);
      setShowAddModal(false);
      setNewAllocation({
        resourceId: '',
        projectId: '',
        allocationPercentage: 0,
        startDate: '',
        endDate: ''
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading resource allocations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resource Allocation</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Allocate Resource
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
                Resource
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Project
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Allocation %
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Timeline
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allocations.map((allocation) => (
              <tr key={allocation.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{allocation.resource.user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{allocation.project.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-full h-2 mr-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${allocation.allocationPercentage}%` }}
                        ></div>
                      </div>
                      <span>{allocation.allocationPercentage}%</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(allocation.startDate).toLocaleDateString()} - 
                    {allocation.endDate ? new Date(allocation.endDate).toLocaleDateString() : 'Ongoing'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <Link href={`/resource-allocations/${allocation.id}/edit`} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </Link>
                  <span className="mx-2 text-gray-300">|</span>
                  <button
                    onClick={() => {
                      // In a real app, this would call an API to delete the allocation
                      setAllocations(prev => prev.filter(a => a.id !== allocation.id));
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {allocations.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No resource allocations found. Allocate resources to projects to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Allocation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Allocate Resource to Project</h3>
                <div className="mt-4">
                  <form onSubmit={handleAddAllocation}>
                    <div className="mb-4">
                      <label htmlFor="resourceId" className="block text-sm font-medium text-gray-700">Resource</label>
                      <select
                        id="resourceId"
                        name="resourceId"
                        required
                        value={newAllocation.resourceId}
                        onChange={handleInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a resource</option>
                        {resources.map(resource => (
                          <option key={resource.id} value={resource.id}>{resource.user.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Project</label>
                      <select
                        id="projectId"
                        name="projectId"
                        required
                        value={newAllocation.projectId}
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
                      <label htmlFor="allocationPercentage" className="block text-sm font-medium text-gray-700">
                        Allocation Percentage: {newAllocation.allocationPercentage}%
                      </label>
                      <input
                        type="range"
                        name="allocationPercentage"
                        id="allocationPercentage"
                        min="0"
                        max="100"
                        step="5"
                        required
                        value={newAllocation.allocationPercentage}
                        onChange={handleInputChange}
                        className="block w-full mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          id="startDate"
                          required
                          value={newAllocation.startDate}
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
                          value={newAllocation.endDate}
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
                        Allocate
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
