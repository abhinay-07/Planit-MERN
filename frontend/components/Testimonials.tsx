import React from 'react';
import type { Testimonial } from '../types';

const testimonials: Testimonial[] = [
    {
        quote: "Plan It's verified reviews are a game changer! I finally know which places are actually good and not just hyped up. It's a must-have for any VIT-AP student.",
        name: 'Anjali S.',
        role: 'VIT-AP Student',
        imageUrl: 'https://picsum.photos/seed/anjali/100/100',
    },
    {
        quote: "The trip planner is amazing. It estimated the cost and distance for our weekend getaway perfectly. Saved us so much time and hassle!",
        name: 'Rohan K.',
        role: 'Local Visitor',
        imageUrl: 'https://picsum.photos/seed/rohan/100/100',
    },
    {
        quote: "Renting a bike through the app was incredibly easy and affordable. The owner was verified, and the whole process was seamless. Highly recommend!",
        name: 'Priya M.',
        role: 'VIT-AP Student',
        imageUrl: 'https://picsum.photos/seed/priya/100/100',
    },
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        What Our Users Are Saying
                    </h2>
                </div>
                <div className="mt-16 grid gap-10 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.name} className="bg-white p-8 rounded-lg shadow-lg flex flex-col">
                            <blockquote className="flex-grow">
                                <p className="text-gray-600 text-lg">"{testimonial.quote}"</p>
                            </blockquote>
                            <footer className="mt-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img className="h-12 w-12 rounded-full" src={testimonial.imageUrl} alt={testimonial.name} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-base font-medium text-gray-900">{testimonial.name}</div>
                                        <div className="text-base text-gray-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;