'use client'

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import Link from 'next/link';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data for charts
  const projectStatusData = [
    { name: 'Planning', value: 4, color: '#0088FE' },
    { name: 'In Progress', value: 8, color: '#00C49F' },
    { name: 'Testing', value: 3, color: '#FFBB28' },
    { name: 'Completed', value: 12, color: '#FF8042' },
  ];

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 18500, expenses: 12000, profit: 6500 },
    { month: 'Feb', revenue: 22300, expenses: 14500, profit: 7800 },
    { month: 'Mar', revenue: 26800, expenses: 16200, profit: 10600 },
    { month: 'Apr', revenue: 24500, expenses: 15800, profit: 8700 },
    { month: 'May', revenue: 32000, expenses: 18500, profit: 13500 },
    { month: 'Jun', revenue: 35400, expenses: 20100, profit: 15300 },
  ];

  const resourceAllocationData = [
    { name: 'AI Engineers', allocated: 8, available: 2 },
    { name: 'Data Scientists', allocated: 5, available: 1 },
    { name: 'Project Managers', allocated: 3, available: 2 },
    { name: 'UI/UX Designers', allocated: 4, available: 0 },
    { name: 'ML Specialists', allocated: 6, available: 1 },
  ];
  
  const clientGrowthData = [
    { month: 'Jan', clients: 5 },
    { month: 'Feb', clients: 7 },
    { month: 'Mar', clients: 8 },
    { month: 'Apr', clients: 10 },
    { month: 'May', clients: 11 },
    { month: 'Jun', clients: 12 },
  ];
  
  const aiModelPerformanceData = [
    { model: 'Chatbot', accuracy: 92, latency: 120, cost: 0.05 },
    { model: 'Sentiment', accuracy: 88, latency: 80, cost: 0.03 },
    { model: 'Image Rec', accuracy: 95, latency: 200, cost: 0.08 },
    { model: 'Prediction', accuracy: 86, latency: 150, cost: 0.06 },
    { model: 'Translation', accuracy: 90, latency: 100, cost: 0.04 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Agency Ecosystem Dashboard</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Export Report
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            Settings
          </button>
        </div>
      </div>
      
      {/* Dashboard Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'clients', 'projects', 'resources', 'financials', 'ai'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Total Clients</h2>
              <p className="text-3xl font-bold">12</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 2 from last month</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded">
            <div className="h-1 bg-blue-600 rounded" style={{ width: '75%' }}></div>
          </div>
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Active Projects</h2>
              <p className="text-3xl font-bold">27</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 5 from last month</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded">
            <div className="h-1 bg-green-600 rounded" style={{ width: '85%' }}></div>
          </div>
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Resource Utilization</h2>
              <p className="text-3xl font-bold">87%</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">↑ 4% from last month</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded">
            <div className="h-1 bg-yellow-600 rounded" style={{ width: '87%' }}></div>
          </div>
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Monthly Revenue</h2>
              <p className="text-3xl font-bold">$35,400</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ $3,400 from last month</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded">
            <div className="h-1 bg-purple-600 rounded" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <>
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Project Status Distribution</h2>
                <select className="border rounded p-1 text-sm">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent })  => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Monthly Revenue</h2>
                <select className="border rounded p-1 text-sm">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                  <option>Last 2 years</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyRevenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Expenses" />
                    <Area type="monotone" dataKey="profit" stackId="3" stroke="#ffc658" fill="#ffc658" name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Resource Allocation</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={resourceAllocationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="allocated" stackId="a" fill="#8884d8" name="Allocated" />
                    <Bar dataKey="available" stackId="a" fill="#82ca9d" name="Available" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Client Growth</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All Clients</button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={clientGrowthData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clients" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Recent Activities and AI Model Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Recent Activities</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>
              <div className="space-y-4">
                {[
                  { action: 'New Project Created', user: 'John Doe', time: '2 hours ago', details: 'AI Chatbot for Customer Service', icon: '📝' },
                  { action: 'Client Added', user: 'Jane Smith', time: '4 hours ago', details: 'TechCorp Inc.', icon: '👥' },
                  { action: 'Project Completed', user: 'Robert Johnson', time: '1 day ago', details: 'Data Analytics Dashboard', icon: '✅' },
                  { action: 'Resource Allocated', user: 'Emily Davis', time: '1 day ago', details: '2 AI Engineers to Project X', icon: '🔄' },
                  { action: 'Invoice Generated', user: 'System', time: '2 days ago', details: '$12,500 for Project Y', icon: '💰' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="mr-3 text-xl">{activity.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <p className="text-sm text-gray-600">By: {activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">AI Model Performance</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latency (ms)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Call</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {aiModelPerformanceData.map((model, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{model.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-2">{model.accuracy}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${model.accuracy}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.latency} ms</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${model.cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
      
      {activeTab !== 'overview' && (
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-medium mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h2>
          <p className="text-gray-600">This section will display detailed information about {activeTab}.</p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">To implement this section, you would need to create a dedicated component for the {activeTab} module.</p>
            <p className="text-blue-700 mt-2">For example, create a <code className="bg-blue-100 px-1 rounded">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}Dashboard.tsx</code> component.</p>
          </div>
          <div className="mt-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Return to Overview Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
