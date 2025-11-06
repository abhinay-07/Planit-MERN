import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer id="footer" className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-white">
              Plan It<span className="text-blue-500 text-3xl">.</span>
            </div>
            <p className="mt-3">Your comprehensive local guide and trip planner.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white">Trip Planner</a></li>
              <li><a href="#vehicle-rentals" className="hover:text-white">Vehicle Rentals</a></li>
              <li><a href="#top-picks" className="hover:text-white">Top Picks</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><span className="hover:text-white cursor-not-allowed">About Us</span></li>
              <li><span className="hover:text-white cursor-not-allowed">Contact</span></li>
              <li><span className="hover:text-white cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Stay Updated</h3>
            <p className="mt-4">Get the latest picks and offers delivered to your inbox.</p>
            <form className="mt-4 sm:flex sm:max-w-md" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                type="email"
                id="email-address"
                className="appearance-none min-w-0 w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
              <div className="mt-3 sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-blue-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p>&copy; {year} Plan It. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
