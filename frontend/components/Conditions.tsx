import React from 'react';
import type { TopPick } from '../types';

const topPicks: TopPick[] = [
    { name: 'Artisan Coffee House', imageUrl: 'https://picsum.photos/seed/cafe/400/300' },
    { name: 'Lakeside Park', imageUrl: 'https://picsum.photos/seed/park/400/300' },
    { name: 'Downtown Food Street', imageUrl: 'https://picsum.photos/seed/food/400/300' },
    { name: 'City Museum', imageUrl: 'https://picsum.photos/seed/museum/400/300' },
    { name: 'The Book Nook', imageUrl: 'https://picsum.photos/seed/bookstore/400/300' },
    { name: 'Sunset Point', imageUrl: 'https://picsum.photos/seed/sunset/400/300' },
];

const TopPicks: React.FC = () => {
    const handleNotImplemented = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        alert('This feature is coming soon!');
    };

    return (
        <section id="top-picks" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        This Week's Top Picks
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover what's trending right now, based on activity from verified VIT-AP students.
                    </p>
                </div>
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {topPicks.map((pick) => (
                        <div key={pick.name} className="relative rounded-lg overflow-hidden group shadow-lg">
                            <img src={pick.imageUrl} alt={pick.name} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                <h3 className="text-white text-2xl font-bold">{pick.name}</h3>
                            </div>
                            <a href="#" onClick={handleNotImplemented} className="absolute inset-0" aria-label={`Learn more about ${pick.name}`}></a>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <a href="#" onClick={handleNotImplemented} className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300">
                        Explore More Destinations
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TopPicks;