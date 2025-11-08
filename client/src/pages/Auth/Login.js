import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    const result = await login(data.email, data.password);
    
    console.log('Login result:', result);
    console.log('User data:', result.user);
    console.log('User type:', result.user?.userType);
    
    if (result.success) {
      // Check if user needs email verification
      if (result.user && !result.user.isEmailVerified) {
        console.log('Redirecting to email verification');
        navigate('/verify-email');
      } else if (result.user && result.user.userType === 'admin') {
        // Redirect admin to admin dashboard
        console.log('Redirecting admin to /admin');
        navigate('/admin');
      } else {
        // Regular users go to home
        console.log('Redirecting regular user to /home');
        navigate('/home');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left - Branding / Illustration */}
        <div className="hidden lg:flex flex-col justify-center rounded-2xl overflow-hidden shadow-lg">
          <div className="relative h-full">
            <img
              src="/assets/images/auth/auth-left.jpg"
              alt="Plan It - discover places"
              className="w-full h-full object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10 p-8 flex flex-col justify-end">
              <div className="text-white px-4">
                <h3 className="text-3xl font-extrabold mb-2">Welcome back</h3>
                <p className="text-sm text-white/90">Discover authentic student reviews, nearby places and trusted local services.</p>
                <div className="mt-6">
                  <ul className="text-white/90 space-y-2 text-sm">
                    <li>• Verified student reviews</li>
                    <li>• Local vehicle rentals</li>
                    <li>• Community trusted</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sign in to Plan It</h2>
              <p className="mt-1 text-sm text-gray-600">Securely access your account</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-100 rounded-full">New?</span>
              <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex gap-3">
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:shadow transition-shadow bg-white">
                <img src="/assets/icons/google.svg" alt="Google" className="w-5 h-5" />
                <span className="text-sm text-gray-700">Sign in with Google</span>
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:shadow transition-shadow bg-white">
                <img src="/assets/icons/github.svg" alt="GitHub" className="w-5 h-5" />
                <span className="text-sm text-gray-700">Sign in with GitHub</span>
              </button>
            </div>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <div className="mt-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      className={`block w-full px-3 py-2 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${errors.email ? 'border-red-300' : ''}`}
                      placeholder="you@domain.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' }
                      })}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className={`block w-full px-3 py-2 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${errors.password ? 'border-red-300' : ''}`}
                      placeholder="Enter your password"
                      {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">Forgot your password?</Link>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                  {loading ? (<div className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Signing In...</div>) : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Small screens - bottom note */}
        <div className="lg:hidden text-center mt-4">
          <p className="text-xs text-gray-500">Need help? Contact <a href="mailto:support@planit.com" className="text-blue-600">support@planit.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;