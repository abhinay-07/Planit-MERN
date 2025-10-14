import React from 'react';

const createIcon = (path: string) => {
    const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    );
    return Icon;
};

export const PhoneIcon = createIcon("M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z");
export const SearchIcon = createIcon("M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z");
export const ShieldCheckIcon = createIcon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z");
export const UserGroupIcon = createIcon("M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z");
export const KeyIcon = createIcon("M12.14,2.14a8,8,0,0,0-8,8,1,1,0,0,0,2,0,6,6,0,1,1,6,6,1,1,0,0,0,0,2,8,8,0,0,0,8-8,8.1,8.1,0,0,0-8-8Zm-1.5,10a1,1,0,1,0,1,1A1,1,0,0,0,10.64,12.14Zm-4.5-4.5L2.29,3.79a1,1,0,0,0-1.42,1.42L5,9.36a1,1,0,0,0,1.42,0l2.83-2.83A1,1,0,0,0,9.24,5.11Z");
export const TrendingUpIcon = createIcon("M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z");
export const TagIcon = createIcon("M20 12l-8-8-1.41 1.41L12 6.83V3a1 1 0 00-2 0v3.83L8.59 5.41 4 10l8 8 8-8zM6.41 10L12 4.41 17.59 10 12 15.59 6.41 10z");
export const MapPinIcon = createIcon("M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z");
export const XIcon = createIcon("M6 18L18 6M6 6l12 12");


export const SocialIcon: React.FC<{ href: string, path: string, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }> = ({ href, path, onClick }) => (
    <a href={href} onClick={onClick} className="text-gray-400 hover:text-blue-500">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={path} />
        </svg>
    </a>
);