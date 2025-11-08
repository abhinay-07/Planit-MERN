import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const userType = watch('userType');

  const years = ['1', '2', '3', '4'];
  const branches = [
    'Computer Science Engineering',
    'Electronics and Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Electrical Engineering',
    'Other'
  ];

  // Email validation based on user type
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    
    if (userType === 'student') {
      if (!email.toLowerCase().endsWith('@vitapstudent.ac.in')) {
        return 'Students must use their VIT-AP email address (@vitapstudent.ac.in)';
      }
    } else {
      if (!/^\S+@\S+$/i.test(email)) {
        return 'Please enter a valid email address';
      }
    }
    return true;
  };

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await registerUser(data);
    
    if (result.success) {
      const message = result.requiresAdminApproval 
        ? 'Registration successful! Your account is pending admin approval. You will be able to login once approved.'
        : result.message || 'Registration successful!';
      setSuccess(message);
      // Don't navigate immediately, show success message
    } else {
      setError(result.message || 'Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left - Illustration */}
        <div className="hidden lg:flex rounded-2xl overflow-hidden shadow-lg">
          <img src="/assets/images/auth/auth-left.jpg" alt="Join Plan It" className="w-full h-full object-cover" />
        </div>

        {/* Right - Form Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="mt-1 text-sm text-gray-600">Join the community and start exploring</p>
            </div>
            <div className="hidden sm:block">
              <Link to="/login" className="text-sm text-gray-500 hover:underline">Already a member? Sign In</Link>
            </div>
          </div>

          <div className="mt-6">
            {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-700">{error}</p></div>}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                    <div className="mt-2">
                      <Link to="/login" className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200">Go to Login</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
                <Controller
                  name="userType"
                  control={control}
                  rules={{ required: 'Please select user type' }}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:shadow">
                        <input type="radio" {...field} value="student" className="h-4 w-4 text-blue-600" />
                        <div className="ml-3 text-sm">
                          <div className="font-medium text-gray-700">VIT-AP Student</div>
                          <div className="text-xs text-gray-500">Requires @vitapstudent.ac.in email</div>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:shadow">
                        <input type="radio" {...field} value="public" className="h-4 w-4 text-blue-600" />
                        <div className="ml-3 text-sm">
                          <div className="font-medium text-gray-700">General Public</div>
                          <div className="text-xs text-gray-500">Visitors and locals</div>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:shadow">
                        <input type="radio" {...field} value="business" className="h-4 w-4 text-blue-600" />
                        <div className="ml-3 text-sm">
                          <div className="font-medium text-gray-700">Business Owner</div>
                          <div className="text-xs text-gray-500">Post offers and manage listings</div>
                        </div>
                      </label>
                    </div>
                  )}
                />
                {errors.userType && <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                  <input id="name" type="text" autoComplete="name" className={`mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : ''}`} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })} />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (optional)</label>
                  <input id="phone" type="tel" autoComplete="tel" className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('phone')} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address {userType === 'student' && <span className="text-xs text-blue-600">(@vitapstudent.ac.in)</span>}</label>
                <input id="email" type="email" autoComplete="email" className={`mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : ''}`} placeholder={userType === 'student' ? 'yourname@vitapstudent.ac.in' : 'you@example.com'} {...register('email', { validate: validateEmail })} />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input id="password" type="password" autoComplete="new-password" className={`mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300' : ''}`} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>

              {userType === 'student' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <h3 className="text-sm font-medium text-blue-900">Student Information</h3>
                  <div>
                    <label htmlFor="vitapId" className="block text-sm font-medium text-gray-700">VIT-AP ID</label>
                    <input id="vitapId" type="text" className={`mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vitapId ? 'border-red-300' : ''}`} placeholder="e.g., 21BCE1234" {...register('vitapId', { required: userType === 'student' ? 'VIT-AP ID is required for students' : false })} />
                    {errors.vitapId && <p className="mt-1 text-sm text-red-600">{errors.vitapId.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                      <select id="year" className={`mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.year ? 'border-red-300' : ''}`} {...register('year', { required: userType === 'student' ? 'Year is required for students' : false })}>
                        <option value="">Select Year</option>
                        {years.map((y) => (<option key={y} value={y}>{y}{y === '1' ? 'st' : y === '2' ? 'nd' : y === '3' ? 'rd' : 'th'} Year</option>))}
                      </select>
                      {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
                      <select id="branch" className={`mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.branch ? 'border-red-300' : ''}`} {...register('branch', { required: userType === 'student' ? 'Branch is required for students' : false })}>
                        <option value="">Select Branch</option>
                        {branches.map((b) => (<option key={b} value={b}>{b}</option>))}
                      </select>
                      {errors.branch && <p className="mt-1 text-sm text-red-600">{errors.branch.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50">
                  {loading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Creating Account...</>) : 'Sign Up'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Small screens note */}
        <div className="lg:hidden text-center mt-4">
          <p className="text-xs text-gray-500">By signing up you agree to our <Link to="/terms" className="text-blue-600">Terms</Link> and <Link to="/privacy" className="text-blue-600">Privacy Policy</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;