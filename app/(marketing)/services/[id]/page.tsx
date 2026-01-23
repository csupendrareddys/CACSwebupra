'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/back-button';
import { CheckCircle, FileText, ArrowRight, Loader2 } from 'lucide-react';

export default function ServiceDetail() {
    const params = useParams();
    const router = useRouter();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;

        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/services?id=${params.id}`);
                const data = await res.json();
                if (data.service) {
                    setService(data.service);
                } else {
                    alert('Service not found');
                    router.push('/');
                }
            } catch (error) {
                console.error("Failed to fetch service details");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [params.id, router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
    );

    if (!service) return null;

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="relative bg-black h-64 md:h-80 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-80" />
                <div className="absolute top-4 left-4 z-10">
                    <BackButton href="/" className="text-white hover:bg-white/10 border-white/20" />
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{service.document_type}</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Professional assistance for all your {service.document_type} needs.
                    </p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-12 -mt-10 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Service Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="h-6 w-6 text-purple-600" />
                                Overview
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                We provide end-to-end support for <strong>{service.document_type}</strong>.
                                Our team of verified professionals ensures your application is processed smoothly and complies with all legal requirements.
                            </p>

                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <h3 className="font-semibold text-purple-900 mb-2">Why choose us?</h3>
                                <ul className="space-y-2 text-sm text-purple-800">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> Verified Experts
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> Secure Document Handling
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> Real-time Status Tracking
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Requirements List */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Required Documents</h2>
                            {service.requirements && service.requirements.length > 0 ? (
                                <ul className="space-y-4">
                                    {service.requirements.map((req: any, i: number) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                                            <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="h-3 w-3 text-green-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{req.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No specific documents listed. Please contact support for details.</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                        <button
                            onClick={() => router.push('/login')} // Or dashboard if logged in, handled by auth guard usually
                            className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            Apply for {service.document_type} <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
