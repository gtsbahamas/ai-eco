import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AIIntegrationDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [aiModels, setAiModels] = useState([]);
  const [aiDeployments, setAiDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    type: 'LLM',
    provider: '',
    description: '',
    capabilities: ''
  });
  const [newDeployment, setNewDeployment] = useState({
    modelId: '',
    projectId: '',
    endpoint: '',
    status: 'Pending',
    description: ''
  });
  const [projects, setProjects] = useState([]);

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
      
      // Fetch AI models
      const modelsResponse = await fetch('/api/ai-models');
      if (!modelsResponse.ok) {
        throw new Error('Failed to fetch AI models');
      }
      const modelsData = await modelsResponse.json();
      
      // Fetch AI deployments
      const deploymentsResponse = await fetch('/api/ai-deployments');
      if (!deploymentsResponse.ok) {
        throw new Error('Failed to fetch AI deployments');
      }
      const deploymentsData = await deploymentsResponse.json();
      
      // Fetch projects for dropdown
      const projectsResponse = await fetch('/api/projects');
      if (!projectsResponse.ok) {
        throw new Error('Failed to fetch projects');
      }
      const projectsData = await projectsResponse.json();
      
      setAiModels(modelsData);
      setAiDeployments(deploymentsData);
      setProjects(projectsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setLoading(false);
      
      // For demo purposes, set some sample data
      setAiModels([
        { 
          id: 'model_1', 
          name: 'GPT-4', 
          type: 'LLM', 
          provider: 'OpenAI',
          description: 'Advanced language model for text generation and understanding',
          capabilities: 'Text generation, summarization, translation, code generation'
        },
        { 
          id: 'model_2', 
          name: 'DALL-E 3', 
          type: 'Image Generation', 
          provider: 'OpenAI',
          description: 'Image generation model based on text prompts',
          capabilities: 'Image creation, style transfer, visual concept generation'
        },
        { 
          id: 'model_3', 
          name: 'Custom Sentiment Analyzer', 
          type: 'Classification', 
          provider: 'In-house',
          description: 'Custom-trained model for sentiment analysis of customer feedback',
          capabilities: 'Sentiment classification, emotion detection, feedback categorization'
        }
      ]);
      
      setAiDeployments([
        { 
          id: 'deployment_1', 
          modelId: 'model_1', 
          projectId: 'project_1',
          endpoint: 'https://api.example.com/ai/gpt4',
          status: 'Active',
          description: 'Content generation for website redesign',
          model: { name: 'GPT-4' },
          project: { name: 'Website Redesign' }
        },
        { 
          id: 'deployment_2', 
          modelId: 'model_3', 
          projectId: 'project_2',
          endpoint: 'https://api.example.com/ai/sentiment',
          status: 'Testing',
          description: 'User feedback analysis for mobile app',
          model: { name: 'Custom Sentiment Analyzer' },
          project: { name: 'Mobile App Development' }
        }
      ]);
      
      setProjects([
        { id: 'project_1', name: 'Website Redesign' },
        { id: 'project_2', name: 'Mobile App Development' },
        { id: 'project_3', name: 'SEO Optimization' }
      ]);
    }
  };

  const handleModelInputChange = (e) => {
    const { name, value } = e.target;
    setNewModel(prev => ({ ...prev, [name]: value }));
  };

  const handleDeploymentInputChange = (e) => {
    const { name, value } = e.target;
    setNewDeployment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddModel = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/ai-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModel),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add AI model');
      }
      
      const data = await response.json();
      setAiModels(prev => [...prev, data.model]);
      setShowAddModelModal(false);
      setNewModel({
        name: '',
        type: 'LLM',
        provider: '',
        description: '',
        capabilities: ''
      });
    } catch (error) {
      console.error('Error adding AI model:', error);
      // For demo purposes, add a fake model
      const fakeModel = {
        id: `model_${Math.floor(Math.random() * 1000)}`,
        name: newModel.name,
        type: newModel.type,
        provider: newModel.provider,
        description: newModel.description,
        capabilities: newModel.capabilities
      };
      
      setAiModels(prev => [...prev, fakeModel]);
      setShowAddModelModal(false);
      setNewModel({
        name: '',
        type: 'LLM',
        provider: '',
        description: '',
        capabilities: ''
      });
    }
  };

  const handleDeployModel = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/ai-deployments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeployment),
      });
      
      if (!response.ok) {
        throw new Error('Failed to deploy AI model');
      }
      
      const data = await response.json();
      
      // Add model and project details to the new deployment for display
      const model = aiModels.find(m => m.id === newDeployment.modelId);
      const project = projects.find(p => p.id === newDeployment.projectId);
      
      const newDeploymentWithDetails = {
        ...data.deployment,
        model: { name: model.name },
        project: { name: project.name }
      };
      
      setAiDeployments(prev => [...prev, newDeploymentWithDetails]);
      setShowDeployModal(false);
      setNewDeployment({
        modelId: '',
        projectId: '',
        endpoint: '',
        status: 'Pending',
        description: ''
      });
    } catch (error) {
      console.error('Error deploying AI model:', error);
      // For demo purposes, add a fake deployment
      const model = aiModels.find(m => m.id === newDeployment.modelId);
      const project = projects.find(p => p.id === newDeployment.projectId);
      
      const fakeDeployment = {
        id: `deployment_${Math.floor(Math.random() * 1000)}`,
        modelId: newDeployment.modelId,
        projectId: newDeployment.projectId,
        endpoint: newDeployment.endpoint || `https://api.example.com/ai/${Math.random().toString(36).substring(7)}`,
        status: newDeployment.status,
        description: newDeployment.description,
        model: { name: model.name },
        project: { name: project.name }
      };
      
      setAiDeployments(prev => [...prev, fakeDeployment]);
      setShowDeployModal(false);
      setNewDeployment({
        modelId: '',
        projectId: '',
        endpoint: '',
        status: 'Pending',
        description: ''
      });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-800 bg-green-100';
      case 'Testing':
        return 'text-blue-800 bg-blue-100';
      case 'Pending':
        return 'text-yellow-800 bg-yellow-100';
      case 'Inactive':
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
          <p className="mt-4 text-lg">Loading AI integration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Integration Strategy</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddModelModal(true)}
            className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Add AI Model
          </button>
          <button
            onClick={() => setShowDeployModal(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Deploy Model
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          <p>{error}</p>
          <p className="mt-2 text-sm">Using sample data instead.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* AI Models */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="px-4 py-5 border-b sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Available AI Models</h3>
            <p className="mt-1 text-sm text-gray-500">AI models that can be deployed to projects</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {aiModels.length === 0 ? (
              <p className="text-center text-gray-500">No AI models available. Add a new model to get started.</p>
            ) : (
              <div className="space-y-4">
                {aiModels.map((model) => (
                  <div key={model.id} className="p-4 transition-colors border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium">{model.name}</h4>
                      <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                        {model.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">Provider: {model.provider}</p>
                    <p className="mt-2 text-sm text-gray-600">{model.description}</p>
                    <div className="mt-3">
                      <h5 className="text-xs font-semibold text-gray-500 uppercase">Capabilities</h5>
                      <p className="mt-1 text-sm text-gray-600">{model.capabilities}</p>
                    </div>
                    <div className="flex justify-end mt-4 space-x-3">
                      <button
                        onClick={() => {
                          setNewDeployment(prev => ({ ...prev, modelId: model.id }));
                          setShowDeployModal(true);
                        }}
                        className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Deploy
                      </button>
                      <Link href={`/ai-models/${model.id}/edit`} className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Deployments */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="px-4 py-5 border-b sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Active Deployments</h3>
            <p className="mt-1 text-sm text-gray-500">AI models deployed to projects</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {aiDeployments.length === 0 ? (
              <p className="text-center text-gray-500">No active deployments. Deploy a model to get started.</p>
            ) : (
              <div className="space-y-4">
                {aiDeployments.map((deployment) => (
                  <div key={deployment.id} className="p-4 transition-colors border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium">{deployment.model.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(deployment.status)}`}>
                        {deployment.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">Project: {deployment.project.name}</p>
                    <p className="mt-2 text-sm text-gray-600">{deployment.description}</p>
                    <div className="mt-3">
                      <h5 className="text-xs font-semibold text-gray-500 uppercase">Endpoint</h5>
                      <p className="p-2 mt-1 text-sm font-mono text-gray-600 bg-gray-100 rounded">{deployment.endpoint}</p>
                    </div>
                    <div className="flex justify-end mt-4 space-x-3">
                      <Link href={`/ai-deployments/${deployment.id}/edit`} className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          // In a real app, this would call an API to update the deployment status
                          setAiDeployments(prev => 
                            prev.map(d => 
                              d.id === deployment.id 
                                ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } 
                                : d
                            )
                          );
                        }}
                        className={`px-3 py-1 text-sm rounded ${
                          deployment.status === 'Active' 
                            ? 'text-red-600 border border-red-600 hover:bg-red-50' 
                            : 'text-green-600 border border-green-600 hover:bg-green-50'
                        }`}
                      >
                        {deployment.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add AI Model Modal */}
      {showAddModelModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Add AI Model</h3>
                <div className="mt-4">
                  <form onSubmit={handleAddModel}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Model Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={newModel.name}
                        onChange={handleModelInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">Model Type</label>
                      <select
                        id="type"
                        name="type"
                        required
                        value={newModel.type}
                        onChange={handleModelInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="LLM">Large Language Model (LLM)</option>
                        <option value="Image Generation">Image Generation</option>
                        <option value="Classification">Classification</option>
                        <option value="Speech Recognition">Speech Recognition</option>
                        <option value="Computer Vision">Computer Vision</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
                      <input
                        type="text"
                        name="provider"
                        id="provider"
                        required
                        value={newModel.provider}
                        onChange={handleModelInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={newModel.description}
                        onChange={handleModelInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="capabilities" className="block text-sm font-medium text-gray-700">Capabilities</label>
                      <textarea
                        name="capabilities"
                        id="capabilities"
                        rows="3"
                        value={newModel.capabilities}
                        onChange={handleModelInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="List key capabilities separated by commas"
                      ></textarea>
                    </div>
                    <div className="flex justify-end mt-4 space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddModelModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Add Model
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deploy Model Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Deploy AI Model</h3>
                <div className="mt-4">
                  <form onSubmit={handleDeployModel}>
                    <div className="mb-4">
                      <label htmlFor="modelId" className="block text-sm font-medium text-gray-700">AI Model</label>
                      <select
                        id="modelId"
                        name="modelId"
                        required
                        value={newDeployment.modelId}
                        onChange={handleDeploymentInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a model</option>
                        {aiModels.map(model => (
                          <option key={model.id} value={model.id}>{model.name} ({model.type})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Project</label>
                      <select
                        id="projectId"
                        name="projectId"
                        required
                        value={newDeployment.projectId}
                        onChange={handleDeploymentInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a project</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700">API Endpoint (Optional)</label>
                      <input
                        type="text"
                        name="endpoint"
                        id="endpoint"
                        value={newDeployment.endpoint}
                        onChange={handleDeploymentInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://api.example.com/ai/endpoint"
                      />
                      <p className="mt-1 text-xs text-gray-500">If left blank, a default endpoint will be generated</p>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">Initial Status</label>
                      <select
                        id="status"
                        name="status"
                        required
                        value={newDeployment.status}
                        onChange={handleDeploymentInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Testing">Testing</option>
                        <option value="Active">Active</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deployment Description</label>
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={newDeployment.description}
                        onChange={handleDeploymentInputChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Describe how this AI model will be used in the project"
                      ></textarea>
                    </div>
                    <div className="flex justify-end mt-4 space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowDeployModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Deploy Model
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
