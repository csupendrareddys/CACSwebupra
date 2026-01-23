import React from 'react';

const Logo = ({ className = "" }) => (
    <div className={`flex flex-col select-none ${className}`}>
        <div className="flex items-baseline leading-none">
            <h1 className="text-4xl font-black tracking-tighter text-[#0B2447] m-0 p-0">UPR</h1>
            <div className="relative w-10 h-10 ml-0.5 flex items-end justify-center">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M50 5 L100 95 H78 L65 70 H35 L22 95 H0 L50 5Z" className="fill-cyan-400" />
                    <path d="M40 70 L55 40 L55 60 L70 60 L48 95 L48 70 H40Z" fill="white" />
                </svg>
            </div>
        </div>
        <div className="text-[8px] font-bold text-[#0B2447] tracking-wide mt-0.5 uppercase whitespace-nowrap">
            Registration <span className="text-cyan-400">|</span> Taxation <span className="text-cyan-400">|</span> Compliance
        </div>
    </div>
);

export default Logo;
