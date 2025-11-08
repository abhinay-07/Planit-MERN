import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    // Always navigate back to the landing page when logo is clicked
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={handleLogoClick} className="flex-shrink-0 cursor-pointer bg-transparent border-none">
              <h1 className="text-2xl font-bold text-white">Plan It</h1>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <Link 
                to="/home" 
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Places
              </Link>
            )}
            <Link 
              to="/vehicles" 
              className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Vehicles
            </Link>

            {/* Admin Link - Only show for admin users */}
            {isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin') && (
              <Link 
                to="/admin" 
                className="text-yellow-300 hover:text-yellow-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-yellow-300 hover:border-yellow-100"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-blue-200 focus:outline-none"
                >
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    {(user?.role === 'admin' || user?.role === 'super_admin') && (
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthenticated && (
                <Link to="/home" className="text-white hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium">
                  Places
                </Link>
              )}
              <Link to="/vehicles" className="text-white hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium">
                Vehicles
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-white hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-white hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="text-white hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;