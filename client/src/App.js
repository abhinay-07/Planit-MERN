import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Layout/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EmailVerification from './pages/Auth/EmailVerification';
import ResendVerification from './pages/Auth/ResendVerification';
import PlaceDetail from './pages/Places/PlaceDetail';
import Vehicles from './pages/Vehicles/Vehicles';
import Profile from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MapsTest from './pages/Test/MapsTest';
import StyleTest from './pages/Test/StyleTest';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';

// Create query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email/:token" element={<EmailVerification />} />
              <Route path="/resend-verification" element={<ResendVerification />} />
              <Route path="/places/:id" element={<PlaceDetail />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/test/maps" element={<MapsTest />} />
              <Route path="/test/style" element={<StyleTest />} />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
