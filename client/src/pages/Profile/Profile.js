import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getVerificationStatus = () => {
    if (user.userType === 'student') {
      switch (user.verificationStatus) {
        case 'approved':
          return { text: 'Student Verified', color: 'bg-green-100 text-green-800' };
        case 'pending':
          return { text: 'Verification Pending', color: 'bg-yellow-100 text-yellow-800' };
        case 'rejected':
          return { text: 'Verification Rejected', color: 'bg-red-100 text-red-800' };
        default:
          return { text: 'Verification Required', color: 'bg-gray-100 text-gray-800' };
      }
    }
    return null;
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'reviews', label: 'My Reviews', icon: '⭐' },
    { id: 'vehicles', label: 'My Vehicles', icon: '🚗' },
    { id: 'trips', label: 'Trip History', icon: '📍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const verificationStatus = getVerificationStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>
              {user.isEmailVerified && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {user.userType === 'student' ? 'VIT-AP Student' : 
                   user.userType === 'business' ? 'Business Owner' : 'General Public'}
                </span>
                {user.isEmailVerified && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Email Verified
                  </span>
                )}
                {verificationStatus && (
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${verificationStatus.color}`}>
                    {verificationStatus.text}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>

            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 transition-colors duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

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
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                      <p className="text-gray-900 capitalize">{user.userType.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Student Information */}
                {user.userType === 'student' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Student Information</h3>
                    <div className="space-y-4">
                      {user.vitapId && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">VIT-AP ID</label>
                          <p className="text-gray-900">{user.vitapId}</p>
                        </div>
                      )}
                      {user.year && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <p className="text-gray-900">
                            {user.year}{user.year === '1' ? 'st' : user.year === '2' ? 'nd' : user.year === '3' ? 'rd' : 'th'} Year
                          </p>
                        </div>
                      )}
                      {user.branch && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                          <p className="text-gray-900">{user.branch}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Account Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${user.isEmailVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-medium">Email Status</p>
                        <p className="text-sm text-gray-600">
                          {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {user.userType === 'student' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          user.verificationStatus === 'approved' ? 'bg-green-500' : 
                          user.verificationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">Student Status</p>
                          <p className="text-sm text-gray-600 capitalize">
                            {user.verificationStatus || 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3 bg-blue-500"></div>
                      <div>
                        <p className="font-medium">Account Type</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {user.userType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              {user.preferences && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Preferences</h3>
                  <div className="space-y-4">
                    {user.preferences.favoriteCategories && user.preferences.favoriteCategories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Categories</label>
                        <div className="flex flex-wrap gap-2">
                          {user.preferences.favoriteCategories.map((category, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {user.preferences.travelRadius && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Travel Radius</label>
                        <p className="text-gray-900">{user.preferences.travelRadius} km</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-4">You haven't written any reviews yet. Share your experiences!</p>
              <Link
                to="/places"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Explore Places
              </Link>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Listed</h3>
              <p className="text-gray-600 mb-4">You haven't listed any vehicles for rent yet.</p>
              <Link
                to="/vehicles/add"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                List Your Vehicle
              </Link>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Trip History</h3>
              <p className="text-gray-600 mb-4">You haven't booked any vehicles or planned trips yet.</p>
              <Link
                to="/vehicles"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Vehicles
              </Link>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email updates about your account</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive SMS updates for bookings</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
                      <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;