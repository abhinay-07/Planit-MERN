import React, { useState } from 'react';

interface NavItem {
  name: string;
  href: string; // Now used as the selector for scrolling
}

interface HeaderProps {
    onLoginClick: () => void;
}

const Logo: React.FC = () => {
    const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    
    return (
        <a href="/" onClick={scrollToTop} className="text-3xl font-bold text-gray-900">
            Plan It
            <span className="text-blue-600 text-4xl">.</span>
        </a>
    );
};

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems: NavItem[] = [
        { name: 'Features', href: '#features' },
        { name: 'Trip Planner', href: '#how-it-works' },
        { name: 'Top Picks', href: '#top-picks' },
        { name: 'About Us', href: '#footer' },
    ];
    
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onLoginClick();
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">
                            {navItems.map((item) => (
                                <a key={item.name} href={item.href} onClick={(e) => handleScroll(e, item.href)} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">
                                    {item.name}
                                </a>
                            ))}
                            <a href="#" onClick={handleLoginClick} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition duration-300">
                                Public Login
                            </a>
                            <a href="#" onClick={handleLoginClick} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition duration-300">
                                Student Login
                            </a>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map((item) => (
                        <a key={item.name} href={item.href} onClick={(e) => handleScroll(e, item.href)} className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                            {item.name}
                        </a>
                    ))}
                    <a href="#" onClick={handleLoginClick} className="bg-blue-600 text-white block w-full text-center mt-2 mx-auto px-4 py-2 rounded-full text-base font-medium hover:bg-blue-700 transition duration-300">
                        Student Login
                    </a>
                    <a href="#" onClick={handleLoginClick} className="bg-gray-200 text-gray-800 block w-full text-center mt-2 mx-auto px-4 py-2 rounded-full text-base font-medium hover:bg-gray-300 transition duration-300">
                        Public Login
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;