import React from 'react';
import { ChevronRight } from 'lucide-react';
import { NAV_MENU } from '../../data/constants';

const MegaMenu = ({ activeMenu, closeMenu, onNavigate, onServiceClick }) => {
    if (!activeMenu) return null;

    const getNavKey = (menu) => {
        switch (menu) {
            case 'Startup': return 'startup';
            case 'MCA': return 'mca';
            case 'Compliance': return 'compliance';
            case 'Global': return 'global';
            case 'Registrations': return 'registrations';
            case 'Trademark': return 'trademark';
            case 'Goods & Services Tax': return 'gst';
            case 'Income Tax': return 'incometax';
            default: return 'home';
        }
    };

    return (
        <div
            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-100 py-10 px-4 z-50 transition-all duration-300 animate-fade-in origin-top"
            onMouseLeave={closeMenu}
        >
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10">
                <div className="col-span-1 bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100/50">
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">{activeMenu}</h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                        Professional assistance for all your {activeMenu.toLowerCase()} requirements. Fast, secure, and fully online.
                    </p>
                    <button
                        onClick={() => {
                            onNavigate(getNavKey(activeMenu));
                            closeMenu();
                        }}
                        className="text-blue-600 font-bold text-sm flex items-center hover:translate-x-1 transition-transform"
                    >
                        View All Services <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
                <div className="col-span-3 grid grid-cols-3 gap-y-3 gap-x-6">
                    {NAV_MENU[activeMenu]?.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                onServiceClick(item.name);
                                closeMenu();
                            }}
                            className="group flex items-center text-left text-slate-600 hover:text-blue-700 p-2 rounded-lg transition-colors hover:bg-blue-50/50"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600 mr-3 shrink-0 transition-colors"></div>
                            <span className="font-medium text-sm">{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
