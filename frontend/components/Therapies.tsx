import React from 'react';
import type { Service } from '../types';
import { ShieldCheckIcon, KeyIcon, UserGroupIcon } from './icons';

const services: Service[] = [
    {
        name: 'Verified Owners',
        description: 'Every vehicle owner on our platform is verified, ensuring your safety and peace of mind on every trip.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Automated Suggestions',
        description: 'Our system automatically suggests the best vehicle options for you based on your trip size and duration.',
        icon: UserGroupIcon,
    },
    {
        name: 'Simple & Secure Booking',
        description: 'Browse available vehicles, select your dates, and book your ride securely in just a few clicks.',
        icon: KeyIcon,
    },
];

const VehicleRentals: React.FC = () => {
    const handleNotImplemented = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        alert('This feature is coming soon!');
    };

    return (
        <section id="vehicle-rentals" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Your Ride, Your Way
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        We offer a trusted and convenient peer-to-peer vehicle rental service tailored to your needs.
                    </p>
                </div>
                <div className="mt-16 grid gap-10 md:grid-cols-3">
                    {services.map((service) => (
                        <div key={service.name} className="bg-gray-50 p-8 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
                             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white">
                                <service.icon className="h-8 w-8" aria-hidden="true" />
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-gray-900">{service.name}</h3>
                            <p className="mt-4 text-base text-gray-500 flex-grow">{service.description}</p>
                            <a href="#" onClick={handleNotImplemented} className="mt-6 text-blue-600 font-semibold hover:text-blue-500">Learn More &rarr;</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VehicleRentals;