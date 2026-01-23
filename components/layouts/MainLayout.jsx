'use client';

import React, { useState } from 'react';
import Logo from '../common/Logo';
import { Search, User, ChevronDown } from 'lucide-react';
import MegaMenu from '../common/MegaMenu';
import { useRouter } from 'next/navigation';
import { NAV_MENU } from '../../data/constants';

const MainLayout = ({ children, user }) => {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState(null);

    const handleNavigate = (path) => {
        router.push('/' + path);
    };

    const handleServiceClick = (serviceName) => {
        router.push(`/service/${encodeURIComponent(serviceName)}`);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* 3-ZONE NAVBAR ARCHITECTURE 
        Zone 1 (Left): Logo (Fixed width)
        Zone 2 (Center): Navigation (Flex-grow, Centered)
        Zone 3 (Right): Search/Actions (Fixed width, Right aligned)
      */}
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100" onMouseLeave={() => setActiveMenu(null)}>
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* ZONE 1: LOGO */}
                    <div className="flex-shrink-0 w-[200px] flex items-center cursor-pointer" onClick={() => router.push('/')}>
                        <Logo />
                    </div>

                    {/* ZONE 2: CENTER MENU (Hidden on mobile) */}
                    <div className="hidden lg:flex flex-1 justify-center items-center px-4 space-x-8">
                        {Object.keys(NAV_MENU).map((key) => (
                            <button
                                key={key}
                                className={`text-sm font-medium transition-colors flex items-center gap-1 py-4 border-b-2 ${activeMenu === key ? 'text-blue-600 border-blue-600' : 'text-slate-600 border-transparent hover:text-blue-600'}`}
                                onMouseEnter={() => setActiveMenu(key)}
                                onClick={() => {
                                    // Map Category keys to their landing pages
                                    // e.g. "Startup" -> /startup
                                    // "Goods & Services Tax" -> /gst (need a map or slugify)
                                    // For now, let's use the MegaMenu's getNavKey logic or handleNavigate
                                    // But handleNavigate adds slash.
                                    // Let's rely on MegaMenu for sub-navigation, but clicking the top link could go to category landing.
                                    // I'll implement simple slugify:
                                    const slug = key.toLowerCase().replace(/ /g, '').replace(/&/g, '');
                                    // Special cases mapping if needed (e.g. incometax)
                                    // The pages I created: startup, mca, compliance, global, registrations, trademark, gst, incometax.
                                    // "Goods & Services Tax" -> "goods services tax" -> "goodsservicestax"?
                                    // My page is 'gst'.
                                    // Let's check getNavKey in MegaMenu.jsx:
                                    /*
                                        case 'Goods & Services Tax': return 'gst';
                                        case 'Income Tax': return 'incometax';
                                    */
                                    let path = key.toLowerCase();
                                    if (key === 'Goods & Services Tax') path = 'gst';
                                    if (key === 'Income Tax') path = 'incometax';
                                    if (key === 'One Person Company') path = 'startup'; // ? No, Startup is a category.
                                    // Wait, NAV_MENU keys are Startup, MCA, Compliance...
                                    handleNavigate(path);
                                }}
                            >
                                {key} <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === key ? 'rotate-180' : ''}`} />
                            </button>
                        ))}
                    </div>

                    {/* ZONE 3: ACTIONS */}
                    <div className="flex-shrink-0 w-[200px] flex items-center justify-end gap-3">
                        {/* Search Input - Desktop */}
                        <div className="hidden md:flex items-center relative group">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                placeholder="Search..."
                                className="pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-full w-32 focus:w-48 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                            />
                        </div>

                        {/* Partner Link */}
                        <button onClick={() => router.push('/partners')} className="hidden md:block text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mr-2">
                            For Partners
                        </button>

                        {/* Login Button */}
                        {user ? (
                            <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                <User className="w-4 h-4" />
                                <span>Dashboard</span>
                            </button>
                        ) : (
                            <button onClick={() => router.push('/login')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                <User className="w-4 h-4" />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mega Menu Overlay */}
                <MegaMenu
                    activeMenu={activeMenu}
                    closeMenu={() => setActiveMenu(null)}
                    onNavigate={handleNavigate}
                    onServiceClick={handleServiceClick}
                />
            </header>

            {/* Main Content Area */}
            <main className="pt-0">
                {children}
            </main>

            {/* Optional: Footer can go here */}
        </div>
    );
};

export default MainLayout;
