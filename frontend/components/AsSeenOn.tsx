
import React from 'react';

const logos = ['FOX', 'CBS', 'NBC', 'USA Today', 'ABC'];

const AsSeenOn: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
                    As Seen On
                </h3>
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12">
                    {logos.map((logo) => (
                        <div key={logo} className="text-2xl font-bold text-gray-400 opacity-80 filter grayscale">
                            {logo}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AsSeenOn;
