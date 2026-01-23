'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building, FileText, Shield, Globe, Award, Calculator, Percent } from 'lucide-react';
import { NAV_MENU } from '../../data/constants';
import ServiceCard from '../common/ServiceCard';
import FAQSection from '../sections/FAQSection';

// Shared Components or Reuse logic?
// Just duplicate structure for simplicity as per user code structure

export const StartupLanding = () => {
    const router = useRouter();
    const onServiceClick = (name) => router.push(`/service/${encodeURIComponent(name)}`);
    return (
        <div className="animate-slide-in bg-white font-inter">
            {/* Startup Hero */}
            <section className="bg-slate-900 text-white pt-32 pb-40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-blue-600/20 backdrop-blur-md text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-8 border border-blue-500/30 uppercase tracking-wider">
                            #1 Platform for Startups
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
                            Turn Your Idea Into a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Registered Business.</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
                            From company registration to IP protection and fundraising, UPRA Fillings is your trusted partner in the startup journey. Join thousands of founders who started here.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <button className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg shadow-blue-900/50">
                                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                            <button className="bg-white/5 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors border border-white/10">
                                Talk to an Expert
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50 px-4 -mt-20 relative z-20 rounded-t-[3rem]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {NAV_MENU.Startup.map((item, idx) => (
                            <ServiceCard
                                key={idx}
                                service={{
                                    title: item.name,
                                    desc: "Comprehensive startup registration services with expert guidance.",
                                    icon: Building,
                                    price: "Enquire"
                                }}
                                onClick={() => onServiceClick(item.name)}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <FAQSection />
        </div>
    );
};

export const MCALanding = () => {
    const router = useRouter();
    const onServiceClick = (name) => router.push(`/service/${encodeURIComponent(name)}`);
    return (
        <div className="animate-slide-in bg-white">
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-emerald-600/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-emerald-500/30">
                            Ministry of Corporate Affairs Services
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Master Your <br />
                            <span className="text-emerald-400">Corporate Compliance.</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                            From company incorporation to annual filings and director changes, we simplify MCA compliance so you can focus on business growth.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center">
                                Explore Services <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gray-50 px-4 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {NAV_MENU.MCA.map((item, idx) => (
                            <ServiceCard
                                key={idx}
                                service={{
                                    title: item.name,
                                    desc: "Expert MCA filing and compliance services for your company.",
                                    icon: FileText,
                                    price: "Enquire"
                                }}
                                onClick={() => onServiceClick(item.name)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export const ComplianceLanding = () => {
    const router = useRouter();
    const onServiceClick = (name) => router.push(`/service/${encodeURIComponent(name)}`);
    return (
        <div className="animate-slide-in bg-white">
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-indigo-600/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-indigo-500/30">
                            Complete Compliance Solutions
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Stay Compliant, <br />
                            <span className="text-indigo-400">Avoid Penalties.</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                            We handle your TDS, PF, ESI, Payroll, and RoC filings so you can run your business worry-free. Dedicated experts for your company.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center">
                                Get Compliant Now <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gray-50 px-4 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {NAV_MENU.Compliance.map((item, idx) => (
                            <ServiceCard
                                key={idx}
                                service={{
                                    title: item.name,
                                    desc: "End-to-end statutory compliance services to keep your business safe.",
                                    icon: Shield,
                                    price: "Enquire"
                                }}
                                onClick={() => onServiceClick(item.name)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export const GlobalLanding = () => {
    const router = useRouter();
    const onServiceClick = (name) => router.push(`/service/${encodeURIComponent(name)}`);
    return (
        <div className="animate-slide-in bg-white">
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-600/10 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-cyan-600/30 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-cyan-500/30">
                            International Business Services
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Expand Your Business <br />
                            <span className="text-cyan-400">Globally.</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                            Incorporate in USA, UK, Singapore, or Dubai. We handle cross-border registrations, international taxation, and global IP protection.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-cyan-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-cyan-700 transition-colors flex items-center justify-center">
                                Go Global <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gray-50 px-4 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {NAV_MENU.Global.map((item, idx) => (
                            <ServiceCard
                                key={idx}
                                service={{
                                    title: item.name,
                                    desc: "Expand your business internationally with our expert guidance.",
                                    icon: Globe,
                                    price: "Enquire"
                                }}
                                onClick={() => onServiceClick(item.name)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export const RegistrationsLanding = () => {
    const router = useRouter();
    const onServiceClick = (name) => router.push(`/service/${encodeURIComponent(name)}`);
    return (
        <div className="animate-slide-in bg-white">
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-green-600/10 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-green-600/30 text-green-300 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-green-500/30">
                            Government Registrations
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Essential Licenses <br />
                            <span className="text-green-400">Made Simple.</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                            Get FSSAI, Shop Act, Udyam, and other mandatory government registrations online. 100% digital process with expert guidance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center">
                                Start Registration <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gray-50 px-4 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {NAV_MENU.Registrations.map((item, idx) => (
                            <ServiceCard
                                key={idx}
                                service={{
                                    title: item.name,
                                    desc: "Obtain necessary government registrations and licenses quickly.",
                                    icon: FileText,
                                    price: "Enquire"
                                }}
                                onClick={() => onServiceClick(item.name)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export const TrademarkLanding = () => {
    const router = useRouter();
    const onServiceClick = (name) => router.push(`/service/${encodeURIComponent(name)}`);
    return (
        <div className="animate-slide-in bg-white">
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-rose-600/10 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-rose-600/30 text-rose-300 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-rose-500/30">
                            Intellectual Property Rights
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Protect Your <br />
                            <span className="text-rose-400">Brand Identity.</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                            Secure your brand name, logo, and slogan with our expert trademark services. From search to registration and objection handling.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-rose-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-rose-700 transition-colors flex items-center justify-center">
                                Secure Your Brand <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gray-50 px-4 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {NAV_MENU.Trademark.map((item, idx) => (
                            <ServiceCard
                                key={idx}
                                service={{
                                    title: item.name,
                                    desc: "Comprehensive IPR services including trademark, copyright, and patent.",
                                    icon: Award,
                                    price: "Enquire"
                                }}
                                onClick={() => onServiceClick(item.name)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export const GSTLanding = () => {
    const router = useRouter();
    const onServiceClick = (name) => router.push(`/service/${encodeURIComponent(name)}`);
    return (
        <div className="animate-slide-in bg-white">
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-600/10 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-amber-600/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-amber-500/30">
                            Goods & Services Tax
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Seamless GST <br />
                            <span className="text-amber-400">Compliance.</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                            From fresh registration to monthly return filing and e-invoicing. We ensure your business is always GST compliant.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-amber-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-amber-700 transition-colors flex items-center justify-center">
                                Get GST Ready <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gray-50 px-4 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {NAV_MENU["Goods & Services Tax"].map((item, idx) => (
                            <ServiceCard
                                key={idx}
                                service={{
                                    title: item.name,
                                    desc: "Complete GST solutions including registration, filing, and advisory.",
                                    icon: Calculator,
                                    price: "Enquire"
                                }}
                                onClick={() => onServiceClick(item.name)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export const IncomeTaxLanding = () => {
    const router = useRouter();
    const onServiceClick = (name) => router.push(`/service/${encodeURIComponent(name)}`);
    return (
        <div className="animate-slide-in bg-white">
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-blue-600/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-blue-500/30">
                            Income Tax Services
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Smart Tax <br />
                            <span className="text-blue-400">Planning & Filing.</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                            Maximize your refunds and stay compliant. Expert assisted ITR filing for salaried, businesses, and professionals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center">
                                File ITR Now <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gray-50 px-4 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {NAV_MENU["Income Tax"].map((item, idx) => (
                            <ServiceCard
                                key={idx}
                                service={{
                                    title: item.name,
                                    desc: "Expert income tax filing and planning services.",
                                    icon: Percent,
                                    price: "Enquire"
                                }}
                                onClick={() => onServiceClick(item.name)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
