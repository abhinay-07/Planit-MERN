import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section
      className="relative bg-cover bg-center py-20"
      style={{ backgroundImage: "url('https://picsum.photos/seed/cta-map/1920/600')" }}
    >
      <div className="absolute inset-0 bg-blue-700 bg-opacity-80" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Ready to Start Exploring?
        </h2>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto">
          Take the first step towards your next adventure. Create your account and
          unlock the best local experiences, tailored just for you.
        </p>
        <div className="mt-8">
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition duration-300 transform hover:scale-105"
          >
            Create Your Free Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
