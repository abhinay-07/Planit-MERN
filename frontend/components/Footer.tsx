import React from 'react';
import { SocialIcon } from './icons';

const Footer: React.FC = () => {
    const handleNotImplemented = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        alert('This feature is coming soon!');
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for subscribing! (This is a demo)');
    };

    return (
        <footer id="footer" className="bg-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo & Info */}
                    <div className="space-y-4">
                         <a href="#" className="text-2xl font-bold text-white">
                            Plan It<span className="text-blue-500 text-3xl">.</span>
                        </a>
                        <p className="text-gray-400">
                            Your comprehensive local guide and trip planner.
                        </p>
                         <div className="flex space-x-6">
                            <SocialIcon href="#" onClick={handleNotImplemented} path="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.28C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10V10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                            <SocialIcon href="#" onClick={handleNotImplemented} path="M13.02,1.021H10.98V4.89h-1.92v3.03h1.92v8.94h3.84v-8.94h2.58l0.33-3.03h-2.91V1.021z" />
                            <SocialIcon href="#" onClick={handleNotImplemented} path="M12,2.2c-5.4,0-9.8,4.4-9.8,9.8s4.4,9.8,9.8,9.8s9.8-4.4,9.8-9.8S17.4,2.2,12,2.2z M12,20.2c-4.5,0-8.2-3.7-8.2-8.2S7.5,3.8,12,3.8s8.2,3.7,8.2,8.2S16.5,20.2,12,20.2z M10.4,9.1c0,0.9,0.7,1.6,1.6,1.6s1.6-0.7,1.6-1.6s-0.7-1.6-1.6-1.6S10.4,8.2,10.4,9.1z M16.1,10.9c-0.1-1-0.4-1.8-0.8-2.6c-0.4-0.8-0.9-1.4-1.7-1.7c-0.8-0.4-1.6-0.6-2.6-0.8C10.1,5.9,9.9,5.8,8.2,5.8c-1.7,0-1.9,0-2.8,0.1c-1,0.1-1.8,0.4-2.6,0.8c-0.8,0.4-1.4,0.9-1.7,1.7c-0.4,0.8-0.6,1.6-0.8,2.6C0.1,11.8,0,12,0,13.7c0,1.7,0,1.9,0.1,2.8c0.1,1,0.4,1.8,0.8,2.6c0.4,0.8,0.9,1.4,1.7,1.7c0.8,0.4,1.6,0.6,2.6,0.8c0.9,0.1,1.1,0.1,2.8,0.1c1.7,0,1.9,0,2.8-0.1c1-0.1,1.8-0.4,2.6-0.8c0.8-0.4,1.4-0.9,1.7-1.7c0.4-0.8,0.6-1.6,0.8-2.6c0.1-0.9,0.1-1.1,0.1-2.8C16.2,12,16.2,11.8,16.1,10.9z" />
                         </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Platform</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#features" className="text-base text-gray-400 hover:text-white">Features</a></li>
                            <li><a href="#how-it-works" className="text-base text-gray-400 hover:text-white">Trip Planner</a></li>
                            <li><a href="#vehicle-rentals" className="text-base text-gray-400 hover:text-white">Vehicle Rentals</a></li>
                            <li><a href="#top-picks" className="text-base text-gray-400 hover:text-white">Top Picks</a></li>
                        </ul>
                    </div>

                    {/* Column 3: About */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" onClick={handleNotImplemented} className="text-base text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#" onClick={handleNotImplemented} className="text-base text-gray-400 hover:text-white">Contact</a></li>
                            <li><a href="#" onClick={handleNotImplemented} className="text-base text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" onClick={handleNotImplemented} className="text-base text-gray-400 hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                         <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Stay Updated</h3>
                         <p className="mt-4 text-gray-400">Get the latest picks and offers delivered to your inbox.</p>
                         <form className="mt-4 sm:flex sm:max-w-md" onSubmit={handleFormSubmit}>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input type="email" name="email-address" id="email-address" autoComplete="email" required className="appearance-none min-w-0 w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email" />
                            <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                                <button type="submit" className="w-full bg-blue-600 flex items-center justify-center border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500">
                                    Subscribe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-base text-gray-400 text-center">
                    <p>&copy; ${new Date().getFullYear()} Plan It. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;