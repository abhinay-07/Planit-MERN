import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/WhyChooseUs';
import HowItWorks from './components/Welcome';
import TopPicks from './components/Conditions';
import VehicleRentals from './components/Therapies';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [initialView, setInitialView] = useState<'login' | 'signup'>('login');

  const handleOpenLogin = () => {
    setInitialView('login');
    setIsLoginOpen(true);
  };
  
  const handleOpenSignup = () => {
    setInitialView('signup');
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => setIsLoginOpen(false);

  return (
    <div className="bg-white text-gray-800">
      <Header onLoginClick={handleOpenLogin} />
      <Login isOpen={isLoginOpen} onClose={handleCloseLogin} initialView={initialView} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <TopPicks />
        <VehicleRentals />
        <Testimonials />
        <CTA onSignupClick={handleOpenSignup} />
      </main>
      <Footer />
    </div>
  );
};

export default App;