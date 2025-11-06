import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingStudents: 0,
    totalBusinesses: 0,
    pendingBusinesses: 0,
    totalPlaces: 0,
    totalVehicles: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [studentsData, setStudentsData] = useState([]);
  const [businessesData, setBusinessesData] = useState([]);

  // Student management functions
  const fetchStudents = async (filters = {}) => {
    try {
      const data = await adminAPI.getStudents(filters);
      setStudentsData(data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    }
  };

  const handleStudentVerification = async (studentId, status, reason = '') => {
    try {
      await adminAPI.verifyStudent(studentId, status, reason);
      toast.success(`Student ${status} successfully`);
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error('Error verifying student:', error);
      toast.error('Failed to verify student');
    }
  };

  // Business management functions
  const fetchBusinesses = async (filters = {}) => {
    try {
      const data = await adminAPI.getBusinesses(filters);
      setBusinessesData(data.businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
    }
  };

  const handleBusinessVerification = async (businessId, status, reason = '') => {
    try {
      await adminAPI.verifyBusiness(businessId, status, reason);
      toast.success(`Business ${status} successfully`);
      fetchBusinesses(); // Refresh the list
    } catch (error) {
      console.error('Error verifying business:', error);
      toast.error('Failed to verify business');
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await adminAPI.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'businesses') {
      fetchBusinesses();
    }
  }, [activeTab]);

  // Redirect if not admin
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'students', label: 'Student Management', icon: '🎓' },
    { id: 'businesses', label: 'Business Management', icon: '🏢' },
    { id: 'places', label: 'Places Management', icon: '📍' },
    { id: 'vehicles', label: 'Vehicle Management', icon: '🚗' },
    { id: 'reviews', label: 'Review Management', icon: '⭐' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📈' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' }
  ];

  const StatCard = ({ title, value, change, changeType, icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              {changeType === 'increase' ? '↗️' : '↘️'} {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage Plan It platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Students"
                  value={stats.totalStudents.toLocaleString()}
                  icon="🎓"
                  color="bg-blue-100"
                />
                <StatCard
                  title="Pending Students"
                  value={stats.pendingStudents.toLocaleString()}
                  icon="⏳"
                  color="bg-yellow-100"
                />
                <StatCard
                  title="Active Businesses"
                  value={stats.totalBusinesses.toLocaleString()}
                  icon="🏢"
                  color="bg-green-100"
                />
                <StatCard
                  title="Total Places"
                  value={stats.totalPlaces.toLocaleString()}
                  icon="📍"
                  color="bg-purple-100"
                />
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Student Registrations</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Arjun Patel', email: 'arjun.patel@vitapstudent.ac.in', time: '2 hours ago', status: 'pending' },
                    { name: 'Priya Singh', email: 'priya.singh@vitapstudent.ac.in', time: '4 hours ago', status: 'approved' },
                    { name: 'Rahul Kumar', email: 'rahul.kumar@vitapstudent.ac.in', time: '6 hours ago', status: 'pending' }
                  ].map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{student.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">System Alerts</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="text-red-500">⚠️</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-red-800">Inappropriate Content Reported</h4>
                        <p className="text-sm text-red-700 mt-1">Review flagged for offensive language needs attention</p>
                        <button className="text-xs text-red-600 hover:text-red-800 mt-2">Review Now →</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="text-yellow-500">📧</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-800">Email Service Notice</h4>
                        <p className="text-sm text-yellow-700 mt-1">Daily email limit approaching (850/1000)</p>
                        <button className="text-xs text-yellow-600 hover:text-yellow-800 mt-2">View Details →</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="text-blue-500">📊</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Weekly Report Available</h4>
                        <p className="text-sm text-blue-700 mt-1">Platform analytics report for Sept 16-22 is ready</p>
                        <button className="text-xs text-blue-600 hover:text-blue-800 mt-2">Download →</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Student Management</h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Students</option>
                  <option>Pending Approval</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIT-AP ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year/Branch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Arjun Patel', email: 'arjun.patel@vitapstudent.ac.in', vitapId: '21BCE1234', year: '3rd', branch: 'CSE', status: 'pending', registered: '2024-09-23' },
                    { name: 'Priya Singh', email: 'priya.singh@vitapstudent.ac.in', vitapId: '21BME5678', year: '2nd', branch: 'Mechanical', status: 'approved', registered: '2024-09-22' }
                  ].map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {student.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.vitapId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.year} Year, {student.branch}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : student.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.registered}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">View</button>
                          {student.status === 'pending' && (
                            <>
                              <button className="text-green-600 hover:text-green-900">Approve</button>
                              <button className="text-red-600 hover:text-red-900">Reject</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'businesses' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Business Management</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Add Business
              </button>
            </div>

            <div className="space-y-6">
              {[
                { name: 'Campus Cafe', owner: 'Raj Kumar', email: 'raj@campuscafe.com', category: 'Restaurant', status: 'approved', places: 1, revenue: '₹45,000' },
                { name: 'VIT Cycle Rentals', owner: 'Amit Sharma', email: 'amit@vitrentals.com', category: 'Vehicle Rental', status: 'pending', places: 0, revenue: '₹0' }
              ].map((business, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                        {business.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-gray-900">{business.name}</h4>
                        <p className="text-sm text-gray-600">{business.category}</p>
                        <p className="text-sm text-gray-500">Owner: {business.owner} ({business.email})</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      business.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {business.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Active Places</p>
                      <p className="text-lg font-semibold">{business.places}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-lg font-semibold">{business.revenue}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">Contact</button>
                    {business.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">Approve</button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add more tab content for other sections */}
        {activeTab !== 'overview' && activeTab !== 'students' && activeTab !== 'businesses' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="py-12">
              <span className="text-6xl mb-4 block">🚧</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} - Coming Soon
              </h3>
              <p className="text-gray-600">This section is under development and will be available soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;