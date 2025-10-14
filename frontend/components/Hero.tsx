import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="relative h-[650px] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/travel-map/1920/1080')" }}>
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="w-full md:w-2/3 text-white text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Your Local Guide, Reimagined.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl max-w-3xl">
                        Discover trending spots, plan trips, and rent vehicles with reviews you can trust. A comprehensive guide for VIT-AP students and the local community.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-center">
                            Start Planning Now
                        </a>
                        <a href="#features" onClick={(e) => { e.preventDefault(); document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition duration-300 text-center">
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;