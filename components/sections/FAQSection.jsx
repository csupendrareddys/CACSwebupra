import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { FAQS } from '../../data/servicesData';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);
    return (
        <section className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-slate-500">Everything you need to know about the process.</p>
                </div>
                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-semibold text-slate-900">{faq.q}</span>
                                {openIndex === i ? <Minus className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-gray-400" />}
                            </button>
                            <div className={`px-6 pb-6 text-slate-600 leading-relaxed ${openIndex === i ? 'block' : 'hidden'}`}>
                                {faq.a}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
