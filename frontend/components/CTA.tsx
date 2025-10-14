import React from 'react';

interface CTAProps {
    onSignupClick: () => void;
}

const CTA: React.FC<CTAProps> = ({ onSignupClick }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onSignupClick();
    };
    
    return (
        <section className="relative bg-cover bg-center py-24" style={{ backgroundImage: "url('https://picsum.photos/seed/cta-map/1920/600')" }}>
            <div className="absolute inset-0 bg-blue-700 bg-opacity-80"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Ready to Start Exploring?
                </h2>
                <p className="mt-6 text-xl max-w-2xl mx-auto">
                    Take the first step towards your next adventure. Sign up for Plan It today and unlock the best local experiences, tailored just for you.
                </p>
                <div className="mt-10">
                    <a href="#" onClick={handleClick} className="inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-full hover:bg-gray-200 transition duration-300 transform hover:scale-105 text-lg">
                        Create Your Free Account
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CTA;