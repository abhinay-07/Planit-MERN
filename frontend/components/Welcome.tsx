import React from 'react';

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="rounded-lg overflow-hidden shadow-2xl">
                        <img 
                            className="w-full h-full object-cover" 
                            src="https://picsum.photos/seed/planning-app/600/500" 
                            alt="App screenshot on a phone"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Get Started in <span className="text-blue-600">Minutes</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Planning your next local adventure has never been easier. Follow these simple steps to unlock a world of possibilities.
                        </p>
                        <ul className="mt-8 space-y-6">
                            <li className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">1</div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Sign Up & Verify</h3>
                                    <p className="mt-1 text-gray-500">Create an account as a student or public user. VIT-AP students get access to exclusive verified reviews.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                               <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">2</div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Discover & Plan</h3>
                                    <p className="mt-1 text-gray-500">Browse top picks, read authentic reviews, and use our trip planner to estimate costs and distance.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                               <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">3</div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Book & Go</h3>
                                    <p className="mt-1 text-gray-500">Find the perfect ride from peer-to-peer rentals, book it instantly, and start your journey!</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;