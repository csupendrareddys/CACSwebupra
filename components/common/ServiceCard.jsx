import React from 'react';
import { FileText } from 'lucide-react';

const ServiceCard = ({ service, onClick }) => {
    const Icon = service.icon || FileText;
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
        >
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-3 tracking-tight">{service.title}</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">{service.desc}</p>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Starts From</span>
                    <span className="font-bold text-slate-900 text-lg">{service.price}</span>
                </div>
                <span className="text-xs text-blue-700 font-bold bg-blue-50 px-4 py-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">Get Started</span>
            </div>
        </div>
    );
};

export default ServiceCard;
