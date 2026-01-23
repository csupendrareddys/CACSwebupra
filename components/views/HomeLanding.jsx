'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Rocket, FileText, Award, Calculator, Percent, Building, Shield, Globe, CheckCircle, Quote, Plus, Minus, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { HOME_CATEGORIES, STATS } from '../../data/servicesData';
import allServices from '../../data/services.json';
import ServiceCard from '../common/ServiceCard';
import TestimonialSection from '../sections/TestimonialSection';
import FAQSection from '../sections/FAQSection';

const HomeLanding = () => {
    // FIX: Removed useOutletContext which causes crash when used in MainLayout
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(null);
    const resultsRef = useRef(null);

    const filteredServices = searchQuery
        ? allServices.filter(service =>
            service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
        )
        : allServices;

    const onSearchInput = (val) => setSearchQuery(val);

    // Check if path is an ID from HOME_CATEGORIES or a direct path
    const handleNavClick = (path) => {
        if (['Startup', 'MCA', 'Compliance', 'Global', 'Registrations', 'Trademark', 'Goods & Services Tax', 'Income Tax'].includes(path)) {
            // Map category ID to route path if needed, or if ID matches path name
            // Our routes are lowercase /startup, /mca, etc.
            const routeMap = {
                'Startup': '/startup',
                'MCA': '/mca',
                'Compliance': '/compliance',
                'Global': '/global',
                'Registrations': '/registrations',
                'Trademark': '/trademark',
                'Goods & Services Tax': '/gst',
                'Income Tax': '/incometax'
            };
            router.push(routeMap[path] || '/' + path.toLowerCase().replace(/ /g, ''));
        } else {
            router.push(path);
        }
    };

    const onNavigate = handleNavClick; // Alias for compatibility

    const handleSearch = (e) => {
        onSearchInput(e.target.value);
        setSearchQuery(e.target.value);

        if (e.target.value && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const scrollToResults = () => {
        if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="animate-slide-in">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-slate-50 via-white to-white pt-24 pb-32 px-4 overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-bl from-blue-50 to-transparent skew-x-[-20deg] translate-x-20 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full blur-[100px] opacity-40"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center bg-white border border-blue-100/60 rounded-full px-4 py-1.5 mb-10 shadow-sm animate-fade-in">
                        <span className="relative flex h-2 w-2 mr-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 tracking-widest uppercase">Trusted by 1 Million+ Businesses</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        Launch Your Business <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            in Just 10 Minutes
                        </span>
                    </h1>

                    <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        India's largest cloud platform for business services.
                        From Incorporation to Trademark, GST, and Income Tax — we handle the compliance so you can focus on growth.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-lg mx-auto w-full mb-16">
                        <div className="relative w-full group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                            <input
                                type="text"
                                placeholder="Search 'Private Limited' or 'Trademark'..."
                                className="relative w-full px-6 py-5 rounded-xl border border-gray-200 shadow-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg text-slate-700 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={handleSearch}
                                onKeyDown={(e) => e.key === 'Enter' && scrollToResults()}
                            />
                            <Search
                                className="absolute right-6 top-6 text-slate-400 w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors"
                                onClick={scrollToResults}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock Partner Logos - Use text with distinct fonts or generic SVGs for now */}
                        <span className="font-bold text-2xl text-slate-400">Google</span>
                        <span className="font-bold text-2xl text-slate-400">ICICI Bank</span>
                        <span className="font-bold text-2xl text-slate-400">Razorpay</span>
                        <span className="font-bold text-2xl text-slate-400">DBS</span>
                    </div>
                </div>
            </section>

            {/* BROWSE BY CATEGORY SECTION (NEW) */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Browse by Category</h2>
                        <p className="text-slate-500 text-lg">Select a service category to get started</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {HOME_CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            // Map string icons to components if needed, or assume they are passed as components
                            // In constants.js we imported the components directly so they should be fine.
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => onNavigate(cat.id)}
                                    className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
                                >
                                    <div className={`w-14 h-14 rounded-full bg-${cat.color}-50 flex items-center justify-center mb-4 group-hover:bg-${cat.color}-600 transition-colors duration-300`}>
                                        <Icon className={`w-6 h-6 text-${cat.color}-600 group-hover:text-white transition-colors duration-300`} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1">{cat.label}</h3>
                                    <span className="text-xs text-slate-400 font-medium">Explore Services &rarr;</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section ref={resultsRef} className="py-24 px-4 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Popular Services</h2>
                        <p className="text-slate-500 text-lg">Everything you need to start and run your business</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                onClick={() => setShowModal(service)}
                            />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <button className="px-10 py-4 bg-white border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm hover:shadow-md">
                            View All 200+ Services
                        </button>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight leading-tight">Why <span className="text-blue-400">UPRA fillings?</span></h2>
                            <p className="text-slate-400 text-xl mb-12 leading-relaxed">
                                We combine modern technology with traditional expertise to provide you with the best business services experience in India.
                            </p>

                            <div className="space-y-8">
                                {[
                                    { title: "AI-Powered Platform", desc: "Our LEDGERS platform automates accounting and compliance." },
                                    { title: "Dedicated Experts", desc: "Get assigned a dedicated Relationship Manager for your business." },
                                    { title: "Transparent Pricing", desc: "No hidden fees. Pay for what you see." },
                                    { title: "Super Fast Service", desc: "We are obsessed with speed and efficiency." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start group">
                                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mr-6 group-hover:bg-blue-600 transition-colors duration-300 shrink-0">
                                            <CheckCircle className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xl mb-2 group-hover:text-blue-300 transition-colors">{item.title}</h4>
                                            <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-10 border border-slate-700/50 shadow-2xl">
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                {STATS.map((stat, idx) => (
                                    <div key={idx} className="text-center p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30">
                                        <p className="text-4xl font-extrabold text-blue-400 mb-2">{stat.value}</p>
                                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-center shadow-lg shadow-blue-900/50">
                                <h3 className="font-bold text-2xl mb-3">Ready to start?</h3>
                                <p className="text-blue-100 mb-6 text-lg">Talk to an expert today for free.</p>
                                <button className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 w-full transition-colors shadow-lg">
                                    Request Callback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Sections for Professional Polish */}
            <TestimonialSection />
            <FAQSection />
            {/* Service Modal moved here */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center space-x-5">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    {/* Fix: safely handle missing icon */}
                                    {(() => {
                                        const Icon = showModal.icon || FileText;
                                        return <Icon className="w-7 h-7 text-blue-600" />;
                                    })()}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-extrabold text-slate-900">{showModal.title}</h3>
                                    <p className="text-blue-600 font-bold text-lg">{showModal.price}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>
                        <p className="text-slate-600 mb-8">Start your {showModal.title} process completely online.</p>
                        <div className="flex space-x-4">
                            <button onClick={() => { setShowModal(null); router.push(`/service/${encodeURIComponent(showModal.title)}`); }} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold">Get Started</button>
                            <button onClick={() => setShowModal(null)} className="flex-1 bg-white border-2 border-gray-100 text-slate-700 py-4 rounded-xl font-bold">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeLanding;
