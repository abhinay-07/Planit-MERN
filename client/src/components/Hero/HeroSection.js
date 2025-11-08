import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../Common/OptimizedImage';
import '../../assets/styles/hero.css';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const { user, isAuthenticated } = useAuth();

  // Consider a user a VIT student when their email belongs to the vitapstudent domain
  const isVITStudent = isAuthenticated && !!user?.email && user.email.toLowerCase().endsWith('@vitapstudent.ac.in');

  // Sources: VIT hero (current) and a generic/alternate hero (replace your image at the path below)
  const vitHeroSrc = '/assets/images/university/hero.jpg';
  const altHeroSrc = '/assets/images/university/landing.jpg';

  return (
    <div className="relative h-screen max-h-screen overflow-hidden">
      {/* Background image — choose based on the signed-in user's email domain */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={isVITStudent ? vitHeroSrc : altHeroSrc}
          alt={isVITStudent ? 'VIT-AP University Campus' : 'Discover places'}
          className="w-full h-full object-cover brightness-110 contrast-105"
          fallbackSrc={isVITStudent ? 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80' : 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}
        />
        
        {/* Professional Text Readability Masks */}
        {/* Left side content mask - only where text appears */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent lg:to-black/10"></div>
        
        {/* Bottom text protection */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Top area subtle darkening for badge */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/30 to-transparent"></div>
        
        {/* Subtle center vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.15)_100%)]"></div>
        
        {/* Optional: Subtle color enhancement overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-indigo-900/5"></div>
        
        {/* Minimal decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        {/* Very subtle particles for ambiance */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${5 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Professional Hero Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 lg:pt-24 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-6rem)]">
            
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Main Heading with University Badge */}
              <div className="space-y-2 lg:space-y-3">
                {/* University Badge - Close to heading */}
                <div className="inline-flex items-center px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white text-xs lg:text-sm font-medium shadow-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                    <span className="font-semibold drop-shadow-lg">{isVITStudent ? 'VIT-AP University' : 'Community'}</span>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <span className="drop-shadow-lg">Student Guide</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight">
                  <span className="block text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] shadow-black/80" 
                        style={{textShadow: '4px 4px 8px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.7)'}}>
                    Plan It
                  </span>
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" 
                    style={{textShadow: '2px 2px 6px rgba(0,0,0,0.8), 1px 1px 3px rgba(0,0,0,0.6)'}}>
                  Your Ultimate
                  <span className="block font-semibold text-cyan-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                    Campus Companion
                  </span>
                </h2>
              </div>

              {/* Enhanced Description */}
              <div className="space-y-3 lg:space-y-4">
                <p className="text-lg md:text-xl lg:text-xl text-white leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" 
                   style={{textShadow: '2px 2px 6px rgba(0,0,0,0.9), 1px 1px 4px rgba(0,0,0,0.7), 0 0 10px rgba(0,0,0,0.5)'}}>
                  Connect with your <span className="text-cyan-100 font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{isVITStudent ? 'VIT-AP community' : 'local community'}</span> through 
                  authentic reviews, discover hidden gems, and make the most of your experience.
                </p>
                
                {/* Feature Highlights */}
                <div className="flex flex-wrap gap-3 lg:gap-4 pt-2 lg:pt-4">
                  <div className="flex items-center space-x-2 text-sm text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" 
                       style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/30"></div>
                    <span>Verified Student Reviews</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" 
                       style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400/30"></div>
                    <span>Local Vehicle Rentals</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" 
                       style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400/30"></div>
                    <span>Community Trusted</span>
                  </div>
                </div>
              </div>

              {/* Professional CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2 lg:pt-4">
                <Link
                  to="/places"
                  className="group relative inline-flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold text-slate-900 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-50 rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="relative flex items-center space-x-2">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Explore Places</span>
                  </div>
                </Link>

                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold text-white border-2 border-white/30 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative flex items-center space-x-2">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Join Community</span>
                  </div>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-between sm:justify-start sm:space-x-6 lg:space-x-8 pt-4 lg:pt-6 text-white/60">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-white">50+</div>
                  <div className="text-xs lg:text-sm">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-white">2+</div>
                  <div className="text-xs lg:text-sm">Places Reviewed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-white">5+</div>
                  <div className="text-xs lg:text-sm">Vehicles Available</div>
                </div>
              </div>
            </div>

            {/* Right Content - Visual Element */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
                
                {/* Main Visual Container */}
                <div className="relative w-96 h-96 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Discover & Connect</h3>
                      <p className="text-white/70 leading-relaxed">
                        {isVITStudent ? 'Join thousands of VIT-AP students sharing authentic experiences and building lasting connections.' : 'Join thousands of users sharing authentic experiences and building lasting connections.'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Scroll Indicator */}
          <div className="flex justify-center pt-16">
            <div className="flex flex-col items-center text-white/50">
              <span className="text-sm font-medium mb-3">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
                <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/95 via-white/70 to-transparent z-10"></div>
    </div>
  );
};

export default HeroSection;