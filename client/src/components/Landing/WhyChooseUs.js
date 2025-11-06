import React from 'react';

const features = [
  {
    title: 'Verified Reviews',
    description:
      'Trustworthy reviews from verified VIT-AP students to help you make informed decisions.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    title: 'Smart Trip Planner',
    description:
      'Plan trips with ease, including cost and distance estimations for any destination.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M3 12h18M3 19h18" />
      </svg>
    ),
  },
  {
    title: 'Peer-to-Peer Rentals',
    description:
      'Access a trusted network of peer-to-peer vehicle rentals for convenient travel.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 13h18M5 17h14M6 9h12l2 4H4l2-4z" />
      </svg>
    ),
  },
  {
    title: 'Weekly Top Picks',
    description:
      'Discover trending destinations and hidden gems based on real student activity.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 15l4-4 3 3 5-6" />
      </svg>
    ),
  },
  {
    title: 'Live Local Offers',
    description:
      'Save money with real-time updates on offers and discounts at local shops and restaurants.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 20V4" />
      </svg>
    ),
  },
];

const WhyChooseUs = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything You Need to Explore
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Plan It combines everything you need for local adventures into one simple platform.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white mx-auto">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
