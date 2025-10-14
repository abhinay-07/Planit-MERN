import React from 'react';
import type { Feature } from '../types';
import { ShieldCheckIcon, MapPinIcon, KeyIcon, TrendingUpIcon, TagIcon } from './icons';

const features: Feature[] = [
    {
        title: 'Verified Reviews',
        description: 'Trustworthy reviews from verified VIT-AP students to help you make informed decisions.',
        icon: ShieldCheckIcon,
    },
    {
        title: 'Smart Trip Planner',
        description: 'Plan your trips with ease, including cost and distance estimations for any destination.',
        icon: MapPinIcon,
    },
    {
        title: 'Peer-to-Peer Rentals',
        description: 'Access a trusted network of peer-to-peer vehicle rentals for convenient travel.',
        icon: KeyIcon,
    },
    {
        title: 'Weekly Top Picks',
        description: 'Discover trending destinations and hidden gems based on real student activity.',
        icon: TrendingUpIcon,
    },
     {
        title: 'Live Local Offers',
        description: 'Save money with real-time updates on offers and discounts at local shops and restaurants.',
        icon: TagIcon,
    },
];

const Features: React.FC = () => {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Everything You Need to Explore
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Plan It combines everything you need for local adventures into one simple platform.
                    </p>
                </div>
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {features.map((feature) => (
                        <div key={feature.title} className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-100">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white mx-auto">
                                <feature.icon className="h-7 w-7" aria-hidden="true" />
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

export default Features;