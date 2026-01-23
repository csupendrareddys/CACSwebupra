import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/servicesData';

const TestimonialSection = () => (
    <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-2 block">Testimonials</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Trusted by Entrepreneurs</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Don't just take our word for it. Here's what founders and business owners have to say about UPRA Filings.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative hover:shadow-lg transition-shadow duration-300">
                        <Quote className="w-10 h-10 text-blue-100 absolute top-6 right-6" />
                        <p className="text-slate-700 italic mb-6 relative z-10 leading-relaxed">"{t.text}"</p>
                        <div>
                            <h4 className="font-bold text-slate-900">{t.name}</h4>
                            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">{t.company}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default TestimonialSection;
