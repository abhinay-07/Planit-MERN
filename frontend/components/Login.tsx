import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XIcon } from './icons';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'login' | 'signup';
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, initialView = 'login' }) => {
    const [activeTab, setActiveTab] = useState<'student' | 'public'>('student');
    const [viewMode, setViewMode] = useState(initialView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setViewMode(initialView);
            // Reset form state when modal opens
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setEmailError('');
            setPasswordError('');
        }
    }, [isOpen, initialView]);

    if (!isOpen) return null;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Reset errors on new submission attempt
        setEmailError('');
        setPasswordError('');

        // Rule 1: Validate email domain for student tab
        if (activeTab === 'student') {
            if (!email.endsWith('@vitapstudent.ac.in') && !email.endsWith('@vitap.ac.in')) {
                setEmailError('Please use a valid VIT-AP student or faculty email.');
                return;
            }
        }

        // Rule 2: Validate password confirmation for signup
        if (viewMode === 'signup') {
            if (password !== confirmPassword) {
                setPasswordError('Passwords do not match.');
                return;
            }
        }

        setLoading(true);
        let result;
        if (viewMode === 'login') {
            result = await login(email, password);
        } else {
            // For registration, we need more fields based on userType
            const userType = activeTab === 'student' ? 'student' : 'public';
            const registerData: any = {
                email,
                password,
                name: email.split('@')[0],
                userType
            };
            
            // Add student-specific fields (these would come from a full form)
            if (userType === 'student') {
                registerData.vitapId = 'TEMP-' + Date.now(); // Temporary - should come from form
                registerData.year = '1'; // Temporary - should come from form
                registerData.branch = 'CSE'; // Temporary - should come from form
            }
            
            result = await register(registerData);
        }
        setLoading(false);

        if (result.success) {
            // Registration now auto-logs in users
            onClose();
            navigate('/home');
        } else {
            setEmailError(result.message || 'Authentication failed');
        }
    };
    
    const handleNotImplemented = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        alert('This feature is coming soon!');
    };

    const isLogin = viewMode === 'login';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300" aria-labelledby="login-modal-title" role="dialog" aria-modal="true">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-transform duration-300 scale-95 animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Close modal">
                    <XIcon className="h-6 w-6" />
                </button>
                
                <div className="p-8">
                    <h2 id="login-modal-title" className="text-2xl font-bold text-center text-gray-800 mb-2">
                        {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        {isLogin ? 'Please enter your details to sign in.' : 'Join our community to start planning.'}
                    </p>

                    <div className="flex border-b border-gray-200 mb-6">
                        <button 
                            onClick={() => setActiveTab('student')} 
                            className={`flex-1 py-3 text-sm font-semibold text-center focus:outline-none transition-colors duration-300 ${activeTab === 'student' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            VIT-AP Student
                        </button>
                        <button 
                            onClick={() => setActiveTab('public')} 
                            className={`flex-1 py-3 text-sm font-semibold text-center focus:outline-none transition-colors duration-300 ${activeTab === 'public' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Public User
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {activeTab === 'student' ? 'VIT-AP Email' : 'Email Address'}
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={activeTab === 'student' ? 'yourname@vitapstudent.ac.in' : 'you@example.com'}
                            />
                            {activeTab === 'student' && !emailError && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Must be a valid @vitapstudent.ac.in or @vitap.ac.in email.
                                </p>
                            )}
                            {emailError && <p className="mt-2 text-xs text-red-600">{emailError}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {!isLogin && (
                             <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input 
                                    type="password" 
                                    name="confirm-password" 
                                    id="confirm-password" 
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="••••••••"
                                />
                                {passwordError && <p className="mt-2 text-xs text-red-600">{passwordError}</p>}
                            </div>
                        )}
                        
                        {isLogin && (
                             <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" onClick={handleNotImplemented} className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                        )}

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        {isLogin ? 'Not a member? ' : 'Already have an account? '}
                        <a href="#" onClick={(e) => { e.preventDefault(); setViewMode(isLogin ? 'signup' : 'login'); }} className="font-medium text-blue-600 hover:text-blue-500">
                            {isLogin ? 'Create an account' : 'Sign In'}
                        </a>
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Login;