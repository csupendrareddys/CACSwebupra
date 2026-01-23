import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Phone, Mail, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import Logo from '../common/Logo';
import MegaMenu from '../common/MegaMenu';
import { NAV_MENU } from '../../data/constants';

const Layout = ({ user, userData }) => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (menuName) => {
        // Map menu names to routes
        const viewMap = {
            'Startup': '/startup', 'MCA': '/mca', 'Compliance': '/compliance',
            'Global': '/global', 'Registrations': '/registrations', 'Trademark': '/trademark',
            'Goods & Services Tax': '/gst', 'Income Tax': '/incometax'
        };
        if (viewMap[menuName]) {
            navigate(viewMap[menuName]);
        } else {
            navigate('/');
        }
        setActiveMenu(null);
        setMobileMenuOpen(false);
    };

    const handleServiceClick = (serviceName) => {
        // Navigate to service page
        navigate(`/service/${encodeURIComponent(serviceName)}`);
        setActiveMenu(null);
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-white font-inter text-slate-800 antialiased">
            {/* Top Bar */}
            <div className="bg-[#0B2447] text-slate-300 text-xs py-2.5 px-4 md:px-8 flex justify-between items-center">
                <div className="flex space-x-6">
                    <span className="flex items-center"><Phone className="w-3 h-3 mr-2 text-cyan-400" /> 044-4000-4000</span>
                    <span className="flex items-center"><Mail className="w-3 h-3 mr-2 text-cyan-400" /> help@uprafillings.com</span>
                </div>
                <div className="flex space-x-6">
                    <Link to="/partners" className="text-cyan-400 font-bold">Partners</Link>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className={`sticky top-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-3' : 'bg-white border-b border-gray-100 py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center space-x-10">
                        <Link to="/" className="cursor-pointer"><Logo /></Link>
                        <div className="hidden xl:flex space-x-8">
                            {Object.keys(NAV_MENU).map((menu) => (
                                <div key={menu} className="relative group" onMouseEnter={() => setActiveMenu(menu)}>
                                    <button onClick={() => handleNavClick(menu)} className="flex items-center text-sm font-semibold py-2 text-slate-600 hover:text-blue-600">
                                        {menu} <ChevronDown className="w-3 h-3 ml-1.5 opacity-50" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 w-64">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input type="text" placeholder="Search services..." className="bg-transparent border-none outline-none text-sm w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>

                        {user ? (
                            <Link to="/dashboard" className="hidden md:flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700">
                                <User className="w-4 h-4 mr-2" /> Dashboard
                            </Link>
                        ) : (
                            <Link to="/login" className="hidden md:flex items-center px-6 py-2.5 bg-[#0B2447] text-white rounded-full font-bold text-sm hover:bg-slate-800">
                                <User className="w-4 h-4 mr-2" /> Login
                            </Link>
                        )}

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden p-2 text-slate-600">
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
                <div onMouseLeave={() => setActiveMenu(null)}>
                    <MegaMenu activeMenu={activeMenu} closeMenu={() => setActiveMenu(null)} onNavigate={handleNavClick} onServiceClick={handleServiceClick} />
                </div>
            </nav>

            {/* Content via Outlet. We pass context for shared state like searchQuery */}
            <Outlet context={{ searchQuery, setSearchQuery, handleNavClick }} />

            {/* Footer */}
            <footer className="bg-slate-50 pt-24 pb-12 border-t border-slate-200 text-sm text-slate-500">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Logo />
                    <p className="mt-4">&copy; 2026 UPRA Filings Private Limited. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
