import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'react-hot-toast';
import axios from 'axios';

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
  const [placesData, setPlacesData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  
  // Modal states
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  
  // Form data
  const [businessForm, setBusinessForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [placeForm, setPlaceForm] = useState({
    name: '', description: '', category: 'restaurant', address: '', 
    city: 'Vijayawada', latitude: '16.5062', longitude: '80.6480', image: ''
  });
  const [vehicleForm, setVehicleForm] = useState({
    make: '', model: '', vehicleType: 'bike', year: new Date().getFullYear(),
    pricePerDay: '', registrationNumber: '', fuelType: 'petrol', seatingCapacity: 2
  });

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

  // Places management functions
  const fetchPlaces = async (filters = {}) => {
    try {
      const data = await adminAPI.getPlaces(filters);
      setPlacesData(data.places);
    } catch (error) {
      console.error('Error fetching places:', error);
      toast.error('Failed to load places');
    }
  };

  const handleDeletePlace = async (placeId) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await adminAPI.deletePlace(placeId);
        toast.success('Place deleted successfully');
        fetchPlaces();
      } catch (error) {
        console.error('Error deleting place:', error);
        toast.error('Failed to delete place');
      }
    }
  };

  // Vehicles management functions
  const fetchVehicles = async (filters = {}) => {
    try {
      const data = await adminAPI.getVehicles(filters);
      setVehiclesData(data.vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await adminAPI.deleteVehicle(vehicleId);
        toast.success('Vehicle deleted successfully');
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast.error('Failed to delete vehicle');
      }
    }
  };

  // Reviews management functions
  const fetchReviews = async (filters = {}) => {
    try {
      const data = await adminAPI.getReviews(filters);
      setReviewsData(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const handleModerateReview = async (reviewId, action, reason = '') => {
    try {
      await adminAPI.moderateReview(reviewId, action, reason);
      toast.success(`Review ${action}ed successfully`);
      fetchReviews();
    } catch (error) {
      console.error('Error moderating review:', error);
      toast.error('Failed to moderate review');
    }
  };

  // Analytics & Reports
  const fetchAnalytics = async () => {
    try {
      const data = await adminAPI.getAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const data = await adminAPI.getRecentActivity();
      setRecentActivity(data);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  // Create Business
  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: businessForm.name,
        email: businessForm.email,
        password: businessForm.password,
        phone: businessForm.phone,
        userType: 'business'
      });
      toast.success('Business account created successfully');
      setShowAddBusinessModal(false);
      setBusinessForm({ name: '', email: '', password: '', phone: '' });
      fetchBusinesses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create business');
    }
  };

  // Create Place
  const handleCreatePlace = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createPlace({
        name: placeForm.name,
        description: placeForm.description,
        category: placeForm.category,
        address: {
          street: placeForm.address,
          city: placeForm.city,
          state: 'Andhra Pradesh'
        },
        location: {
          latitude: parseFloat(placeForm.latitude),
          longitude: parseFloat(placeForm.longitude)
        },
        image: placeForm.image
      });
      toast.success('Place added successfully');
      setShowAddPlaceModal(false);
      setPlaceForm({
        name: '', description: '', category: 'restaurant', address: '', 
        city: 'Vijayawada', latitude: '16.5062', longitude: '80.6480', image: ''
      });
      fetchPlaces();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add place');
    }
  };

  // Create Vehicle
  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createVehicle({
        vehicleType: vehicleForm.vehicleType,
        make: vehicleForm.make,
        model: vehicleForm.model,
        year: Number.parseInt(vehicleForm.year),
        registrationNumber: vehicleForm.registrationNumber,
        fuelType: vehicleForm.fuelType,
        seatingCapacity: Number.parseInt(vehicleForm.seatingCapacity),
        pricePerDay: Number.parseFloat(vehicleForm.pricePerDay),
        description: `${vehicleForm.year} ${vehicleForm.make} ${vehicleForm.model}`,
        features: [],
        images: []
      });
      toast.success('Vehicle added successfully');
      setShowAddVehicleModal(false);
      setVehicleForm({
        make: '', model: '', vehicleType: 'bike', year: new Date().getFullYear(),
        pricePerDay: '', registrationNumber: '', fuelType: 'petrol', seatingCapacity: 2
      });
      fetchVehicles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vehicle');
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await adminAPI.getDashboardStats();
        setStats(dashboardStats);
        await fetchRecentActivity();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'businesses') {
      fetchBusinesses();
    } else if (activeTab === 'places') {
      fetchPlaces();
    } else if (activeTab === 'vehicles') {
      fetchVehicles();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    } else if (activeTab === 'reports') {
      fetchAnalytics();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  // Redirect if not admin
  console.log('AdminDashboard - Current user:', user);
  console.log('AdminDashboard - User type:', user?.userType);
  console.log('AdminDashboard - User role:', user?.role);
  
  if (!user || (user.userType !== 'admin' && user.role !== 'admin' && user.role !== 'super_admin')) {
    console.log('AdminDashboard - Not admin, redirecting to /');
    return <Navigate to="/" replace />;
  }
  
  console.log('AdminDashboard - User is admin, showing dashboard');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'students', label: 'Users (Students & Public)', icon: '👥' },
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
                  {recentActivity && recentActivity.recentUsers && recentActivity.recentUsers.length > 0 ? (
                    recentActivity.recentUsers.map((student) => (
                      <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                            student.verificationStatus === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.verificationStatus}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(student.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent student registrations</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Places Added</h3>
                <div className="space-y-4">
                  {recentActivity && recentActivity.recentPlaces && recentActivity.recentPlaces.length > 0 ? (
                    recentActivity.recentPlaces.map((place) => (
                      <div key={place._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            📍
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{place.name}</p>
                            <p className="text-xs text-gray-500">
                              By {place.addedBy?.name || 'Admin'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(place.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent places added</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Total Vehicles</h4>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Available for rent</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Total Reviews</h4>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">User feedback</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Pending Businesses</h4>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBusinesses.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">User Management (Students & Public)</h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Users</option>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIT-AP ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year/Branch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentsData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No users found. Users will appear here after registration.
                      </td>
                    </tr>
                  ) : (
                    studentsData.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 ${student.userType === 'public' ? 'bg-green-600' : 'bg-blue-600'} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                              {student.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.userType === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {student.userType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.vitapId || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.year ? `${student.year} Year` : 'N/A'}, {student.branch || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.verificationStatus === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : student.verificationStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.verificationStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {student.verificationStatus === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleStudentVerification(student._id, 'approved')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => {
                                    const reason = prompt('Enter rejection reason (optional):');
                                    handleStudentVerification(student._id, 'rejected', reason || '');
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {student.verificationStatus !== 'pending' && (
                              <span className="text-gray-400">No actions</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'businesses' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Business Management</h3>
              <button 
                onClick={() => setShowAddBusinessModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add Business
              </button>
            </div>

            <div className="space-y-6">
              {businessesData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No businesses found. Businesses will appear here after registration.
                </div>
              ) : (
                businessesData.map((business) => (
                  <div key={business._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                          {business.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-900">{business.name}</h4>
                          <p className="text-sm text-gray-600">{business.userType}</p>
                          <p className="text-sm text-gray-500">{business.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        business.verificationStatus === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : business.verificationStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.verificationStatus}
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Active Places</p>
                        <p className="text-lg font-semibold">{business.stats?.placesCount || 0}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Active Vehicles</p>
                        <p className="text-lg font-semibold">{business.stats?.vehiclesCount || 0}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
                      {business.verificationStatus === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleBusinessVerification(business._id, 'approved')}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => {
                              const reason = prompt('Enter rejection reason (optional):');
                              handleBusinessVerification(business._id, 'rejected', reason || '');
                            }}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'places' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Places Management</h3>
              <button 
                onClick={() => setShowAddPlaceModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add Place
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Place Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {placesData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No places found.
                      </td>
                    </tr>
                  ) : (
                    placesData.map((place) => (
                      <tr key={place._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {place.images && place.images[0] && (
                              <img 
                                src={place.images[0].url || '/assets/images/places/default.jpg'} 
                                alt={place.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <span className="ml-3 text-sm font-medium">{place.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{place.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {place.address?.city || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          ⭐ {place.ratings?.overall?.toFixed(1) || '0.0'} ({place.reviewCount?.total || 0})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => handleDeletePlace(place._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Vehicles Management</h3>
              <button 
                onClick={() => setShowAddVehicleModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add Vehicle
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehiclesData.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No vehicles found.
                </div>
              ) : (
                vehiclesData.map((vehicle) => (
                  <div key={vehicle._id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
                    {vehicle.images && vehicle.images[0] && (
                      <img
                        src={vehicle.images[0].url || '/assets/images/vehicles/default.jpg'}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h4 className="font-semibold text-lg mb-2">{vehicle.make} {vehicle.model}</h4>
                    <p className="text-sm text-gray-600 mb-2">{vehicle.vehicleType} - {vehicle.year}</p>
                    <p className="text-lg font-bold text-blue-600 mb-3">₹{vehicle.pricePerDay}/day</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vehicle.availability?.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.availability?.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <button 
                        onClick={() => handleDeleteVehicle(vehicle._id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Reviews Management</h3>
            
            <div className="space-y-4">
              {reviewsData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No reviews found. Reviews from users will appear here.
                </div>
              ) : (
                reviewsData.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600">Place: {review.place?.name || 'Unknown'}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{review.content || review.comment || 'No content'}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <div className="space-x-3">
                        {review.isFlagged && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Flagged</span>
                        )}
                        {!review.isVisible && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Hidden</span>
                        )}
                        <button 
                          onClick={() => handleModerateReview(review._id, 'approve')}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleModerateReview(review._id, 'hide', 'Inappropriate content')}
                          className="text-yellow-600 hover:text-yellow-900 text-sm"
                        >
                          Hide
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this review?')) {
                              handleModerateReview(review._id, 'delete');
                            }
                          }}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && analyticsData && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Platform Analytics & Reports</h3>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                  <p className="text-sm opacity-90 mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{analyticsData.users?.total || 0}</p>
                  <p className="text-xs opacity-75 mt-2">+{analyticsData.users?.newLast30Days || 0} this month</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                  <p className="text-sm opacity-90 mb-1">Total Places</p>
                  <p className="text-3xl font-bold">{analyticsData.content?.places?.total || 0}</p>
                  <p className="text-xs opacity-75 mt-2">+{analyticsData.content?.places?.newLast30Days || 0} this month</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                  <p className="text-sm opacity-90 mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold">{analyticsData.content?.reviews?.total || 0}</p>
                  <p className="text-xs opacity-75 mt-2">Avg: {analyticsData.content?.reviews?.averageRating || 0} ⭐</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
                  <p className="text-sm opacity-90 mb-1">Total Vehicles</p>
                  <p className="text-3xl font-bold">{analyticsData.content?.vehicles?.total || 0}</p>
                  <p className="text-xs opacity-75 mt-2">{analyticsData.content?.vehicles?.available || 0} available</p>
                </div>
              </div>

              {/* User Analytics */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold mb-4">User Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Students</p>
                    <p className="text-2xl font-bold">{analyticsData.users?.students?.total || 0}</p>
                    <p className="text-sm text-green-600">
                      {analyticsData.users?.students?.approvalRate || 0}% approved
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Pending Students</p>
                    <p className="text-2xl font-bold">{analyticsData.users?.students?.pending || 0}</p>
                    <p className="text-sm text-yellow-600">Awaiting approval</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Businesses</p>
                    <p className="text-2xl font-bold">{analyticsData.users?.businesses?.total || 0}</p>
                    <p className="text-sm text-blue-600">
                      {analyticsData.users?.businesses?.approved || 0} active
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4">Places by Category</h4>
                  <div className="space-y-3">
                    {analyticsData.content?.places?.byCategory && analyticsData.content.places.byCategory.length > 0 ? (
                      analyticsData.content.places.byCategory.map((cat, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{cat._id || 'Uncategorized'}</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {cat.count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No data available</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4">Vehicles by Type</h4>
                  <div className="space-y-3">
                    {analyticsData.content?.vehicles?.byType && analyticsData.content.vehicles.byType.length > 0 ? (
                      analyticsData.content.vehicles.byType.map((type, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{type._id || 'Unknown'}</span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {type.count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">System Settings</h3>
            
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h4 className="font-semibold mb-3">Email Configuration</h4>
                <p className="text-sm text-gray-600 mb-3">Configure email settings for notifications and verification.</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Configure Email
                </button>
              </div>

              <div className="border-b pb-6">
                <h4 className="font-semibold mb-3">Platform Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Auto-approve public users</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Enable email verification for students</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Allow user reviews</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Database Management</h4>
                <div className="space-x-3">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                    Backup Database
                  </button>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Business Modal */}
      {showAddBusinessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Business</h3>
              <button 
                onClick={() => setShowAddBusinessModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateBusiness} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={businessForm.name}
                  onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={businessForm.email}
                  onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={businessForm.password}
                  onChange={(e) => setBusinessForm({...businessForm, password: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={businessForm.phone}
                  onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBusinessModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Place Modal */}
      {showAddPlaceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Place</h3>
              <button 
                onClick={() => setShowAddPlaceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePlace} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Place Name</label>
                  <input
                    type="text"
                    required
                    value={placeForm.name}
                    onChange={(e) => setPlaceForm({...placeForm, name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={placeForm.description}
                    onChange={(e) => setPlaceForm({...placeForm, description: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    required
                    value={placeForm.category}
                    onChange={(e) => setPlaceForm({...placeForm, category: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select category</option>
                    <option value="temple">Temple</option>
                    <option value="museum">Museum</option>
                    <option value="park">Park</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="cafe">Cafe</option>
                    <option value="shopping">Shopping</option>
                    <option value="historical">Historical</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={placeForm.city}
                    onChange={(e) => setPlaceForm({...placeForm, city: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={placeForm.address}
                    onChange={(e) => setPlaceForm({...placeForm, address: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={placeForm.latitude}
                    onChange={(e) => setPlaceForm({...placeForm, latitude: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={placeForm.longitude}
                    onChange={(e) => setPlaceForm({...placeForm, longitude: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    value={placeForm.image}
                    onChange={(e) => setPlaceForm({...placeForm, image: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., /assets/images/places/place.jpg"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPlaceModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Vehicle</h3>
              <button 
                onClick={() => setShowAddVehicleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({...vehicleForm, make: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <select
                    required
                    value={vehicleForm.vehicleType}
                    onChange={(e) => setVehicleForm({...vehicleForm, vehicleType: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select type</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="car">Car</option>
                    <option value="auto">Auto</option>
                    <option value="cycle">Cycle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input
                    type="number"
                    required
                    min="2000"
                    max="2025"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({...vehicleForm, year: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price per Day (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={vehicleForm.pricePerDay}
                    onChange={(e) => setVehicleForm({...vehicleForm, pricePerDay: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Number</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.registrationNumber}
                    onChange={(e) => setVehicleForm({...vehicleForm, registrationNumber: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., AP39AB1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fuel Type</label>
                  <select
                    required
                    value={vehicleForm.fuelType}
                    onChange={(e) => setVehicleForm({...vehicleForm, fuelType: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select fuel type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="cng">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={vehicleForm.seatingCapacity}
                    onChange={(e) => setVehicleForm({...vehicleForm, seatingCapacity: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;