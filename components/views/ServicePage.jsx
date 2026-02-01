'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Info, ThumbsUp, ThumbsDown, Star, X, Clock, Tag, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SERVICE_DETAILS } from '../../data/servicesData';
import { useOrderStore } from '../../store/orderStore';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const ServicePage = ({ onBook }) => {
    const params = useParams();
    // In Next.js app directory, params might be available via hooks or props.
    // If this component is used in a page directly, params should be passed or grabbed.
    // If it's the page itself, it receives params as props.
    // But here it's a component.
    const { slug } = params || {};
    const serviceName = slug ? decodeURIComponent(slug) : 'Service';

    const router = useRouter();
    const { user } = useOrderStore();

    const details = SERVICE_DETAILS[serviceName];

    const content = details || {
        title: serviceName,
        description: `Get your ${serviceName} done completely online with expert assistance. We simplify the legal process so you can focus on your business.`,
        whatIs: null,
        requirements: null,
        process: [
            { title: "Fill Application", desc: "Submit your details in our simple online form." },
            { title: "Expert Review", desc: "Our professionals verify your documents and file the application." },
            { title: "Get Delivered", desc: "Receive your registration certificate via email/post." }
        ],
        pros: [],
        cons: [],
        documents: ["PAN Card", "Aadhar Card", "Photo"]
    };

    const [isBooking, setIsBooking] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Check authentication on mount
    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setCheckingAuth(false);
            }
        };
        checkAuth();
    }, []);

    // Zod Schema
    const bookingSchema = z.object({
        fullName: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    });

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            fullName: user?.name || '',
            email: user?.email || '',
            phone: ''
        }
    });

    // Get base price
    const getBasePrice = () => {
        if (content.price) {
            const parsed = parseInt(content.price.toString().replace(/[^0-9]/g, ''));
            if (!isNaN(parsed)) return parsed;
        }
        return 1000;
    };

    const basePrice = getBasePrice();
    const finalPrice = Math.max(0, basePrice - discount);

    // Apply voucher code
    const applyVoucher = async () => {
        if (!voucherCode.trim()) {
            toast.error('Please enter a voucher code');
            return;
        }

        setVoucherLoading(true);
        try {
            const res = await fetch('/api/vouchers/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    code: voucherCode, 
                    orderAmount: basePrice 
                })
            });
            const data = await res.json();

            if (data.valid) {
                setAppliedVoucher(data.voucher);
                setDiscount(data.discount);
                toast.success(data.message);
            } else {
                toast.error(data.error || 'Invalid voucher code');
                setAppliedVoucher(null);
                setDiscount(0);
            }
        } catch (error) {
            toast.error('Failed to validate voucher');
        } finally {
            setVoucherLoading(false);
        }
    };

    // Remove voucher
    const removeVoucher = () => {
        setAppliedVoucher(null);
        setDiscount(0);
        setVoucherCode('');
    };

    const handlePayment = async (dbOrderId, amount, userDetails) => {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            toast.error('Razorpay SDK failed to load');
            return;
        }

        // 1. Create Razorpay Order
        const response = await fetch('/api/razorpay/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount }),
        });
        const data = await response.json();

        if (data.error) {
            toast.error("Could not initiate payment");
            return;
        }

        // 2. Open Razorpay Modal
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "CACS Web App",
            description: `Payment for ${serviceName}`,
            order_id: data.id, // Razorpay Order ID
            handler: async function (response) {
                // 3. Verify Payment on Backend
                const verifyRes = await fetch('/api/razorpay/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        dbOrderId: dbOrderId
                    }),
                });

                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                    toast.success('Payment Successful!');
                    // Use the onBook prop if it exists (for compatibility) or navigate
                    if (onBook) {
                        onBook({ ...userDetails, id: dbOrderId, status: 'PAYMENT_COMPLETED' });
                    } else {
                        router.push('/dashboard');
                    }
                } else {
                    toast.error('Payment verification failed');
                }
            },
            prefill: {
                name: userDetails.fullName,
                email: userDetails.email,
                contact: userDetails.phone,
            },
            theme: { color: "#2563EB" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const onSubmit = async (data) => {
        setIsBooking(true);
        try {
            // 1. Create Order in DB
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceName: serviceName,
                    remarks: "New Booking via Web",
                    voucherCode: appliedVoucher?.code || null,
                    discountAmount: discount || null
                })
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || "Failed to create order");
            }

            // 2. Trigger Razorpay with discounted price
            // If finalPrice is 0 (100% discount), skip payment
            if (finalPrice <= 0) {
                // Mark as payment completed directly
                const verifyRes = await fetch('/api/razorpay/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dbOrderId: orderData.order.id,
                        freeOrder: true
                    }),
                });
                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                    toast.success('Order placed successfully! (100% discount applied)');
                    router.push('/dashboard');
                } else {
                    toast.error('Order processing failed');
                }
                return;
            }

            await handlePayment(orderData.order.id, finalPrice, data);

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to create order");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="animate-slide-in bg-white min-h-screen">
            <div className="bg-slate-50 border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
                    </button>
                </div>
            </div>

            <section className="bg-white pt-12 pb-16 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-6">
                            FAST & ONLINE
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                            {content.title}
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            {content.description}
                        </p>

                        {(content.price || content.timeline) && (
                            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-medium">
                                {content.price && (
                                    <div className="flex items-center text-slate-900 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                                        <span className="text-slate-500 mr-2">Starting at:</span>
                                        <span className="text-2xl font-bold text-green-700">{content.price}</span>
                                    </div>
                                )}
                                {content.timeline && (
                                    <div className="flex items-center text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                                        <Clock className="w-5 h-5 mr-2 text-slate-500" />
                                        <span>{content.timeline}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        toast.error('Please login to book a service');
                                        router.push('/login');
                                        return;
                                    }
                                    setIsBooking(true);
                                }}
                                disabled={checkingAuth}
                                className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                                {checkingAuth ? 'Loading...' : 'Book Now'}
                            </button>
                            <div className="flex items-center text-slate-600 px-4">
                                <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                                <span className="font-bold mr-1">4.8/5</span> Rating
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-500">
                            <span className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> 100% Online Process</span>
                            <span className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Expert Support</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-slate-50 rounded-2xl p-8 border border-gray-100 shadow-xl relative z-10">
                            {!isAuthenticated && !checkingAuth ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-xl mb-2 text-slate-900">Login Required</h3>
                                    <p className="text-slate-600 mb-6">Please login or signup to book this service</p>
                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => router.push('/login')}
                                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Login
                                        </button>
                                        <button 
                                            onClick={() => router.push('/signup')}
                                            className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            Create Account
                                        </button>
                                    </div>
                                </div>
                            ) : isBooking ? (
                                <div className="animate-fade-in">
                                    <h3 className="font-bold text-xl mb-4 text-slate-900">Finalize Booking</h3>
                                    <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800">
                                        Simulating Payment & Document Upload...
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">YOUR NAME</label>
                                            <input
                                                {...register("fullName")}
                                                type="text"
                                                className={`w-full p-2 border rounded ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">EMAIL</label>
                                            <input
                                                {...register("email")}
                                                type="email"
                                                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">PHONE</label>
                                            <input
                                                {...register("phone")}
                                                type="tel"
                                                className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                                placeholder="9876543210"
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                        </div>

                                        {/* Voucher Code Section */}
                                        <div className="border-t pt-4 mt-4">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">
                                                <Tag className="w-3 h-3 inline mr-1" />
                                                VOUCHER CODE
                                            </label>
                                            {appliedVoucher ? (
                                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-2">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                        <span className="text-green-700 font-medium text-sm">{appliedVoucher.code}</span>
                                                        <span className="text-green-600 text-xs">
                                                            ({appliedVoucher.discountType === 'PERCENTAGE' 
                                                                ? `${appliedVoucher.discountValue}% off` 
                                                                : `₹${appliedVoucher.discountValue} off`})
                                                        </span>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={removeVoucher}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={voucherCode}
                                                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                                        className="flex-1 p-2 border border-gray-200 rounded text-sm"
                                                        placeholder="Enter voucher code"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={applyVoucher}
                                                        disabled={voucherLoading}
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                                                    >
                                                        {voucherLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="bg-slate-100 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Service Price</span>
                                                <span className="font-medium">₹{basePrice.toLocaleString()}</span>
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex justify-between text-sm text-green-600">
                                                    <span>Discount</span>
                                                    <span>-₹{discount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="border-t pt-2 flex justify-between font-bold">
                                                <span>Total</span>
                                                <span className="text-lg text-blue-600">
                                                    {finalPrice <= 0 ? 'FREE' : `₹${finalPrice.toLocaleString()}`}
                                                </span>
                                            </div>
                                        </div>

                                        <button disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed">
                                            {isSubmitting ? 'Processing...' : finalPrice <= 0 ? 'Complete Order (Free)' : 'Pay & Submit Order'}
                                        </button>
                                        <button type="button" onClick={() => setIsBooking(false)} className="w-full text-gray-500 text-sm py-2">Cancel</button>
                                    </form>
                                </div>
                            ) : isAuthenticated ? (
                                <>
                                    <h3 className="font-bold text-xl mb-6">Ready to Book?</h3>
                                    <p className="text-slate-600 mb-4">Click "Book Now" to proceed with your order.</p>
                                    <button 
                                        onClick={() => setIsBooking(true)}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Start Booking
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-bold text-xl mb-6">Request a Callback</h3>
                                    <form className="space-y-4">
                                        <input type="text" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none" placeholder="Full Name" />
                                        <input type="email" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none" placeholder="Email" />
                                        <input type="tel" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none" placeholder="Phone" />
                                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
                                            Get Free Consultation
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                        <div className="absolute top-10 -right-10 w-full h-full bg-blue-600/5 rounded-2xl -z-10"></div>
                    </div>
                </div>
            </section>

            {/* What Is & Requirements Section */}
            {(content.whatIs || content.requirements) && (
                <section className="py-16 px-4 bg-slate-50">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {content.whatIs && (
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <Info className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4">What is it?</h2>
                                    <p className="text-slate-600 leading-relaxed text-lg">{content.whatIs}</p>
                                </div>
                            </div>
                        )}

                        {content.requirements && (
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Eligibility & Requirements</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {content.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start text-slate-600 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 shrink-0"></div>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Pros and Cons */}
            {(content.pros.length > 0 || content.cons.length > 0) && (
                <section className="py-16 px-4 bg-white border-t border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">Is this right for you?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-green-50/50 p-8 rounded-2xl border border-green-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <ThumbsUp className="w-6 h-6 text-green-600" />
                                    <h3 className="text-xl font-bold text-slate-900">Benefits</h3>
                                </div>
                                <ul className="space-y-4">
                                    {content.pros.map((pro, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-700">
                                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <span>{pro}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-red-50/50 p-8 rounded-2xl border border-red-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <ThumbsDown className="w-6 h-6 text-red-600" />
                                    <h3 className="text-xl font-bold text-slate-900">Disadvantages</h3>
                                </div>
                                <ul className="space-y-4">
                                    {content.cons.map((con, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-700">
                                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                            <span>{con}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="py-20 bg-gray-50 px-4 border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-gray-500">Simple process to get your {serviceName}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.process.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all">
                                <span className="text-6xl font-black text-gray-50 absolute -right-4 -top-4 group-hover:text-blue-50 transition-colors">{idx + 1}</span>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mb-4">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">Documents Required</h2>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                        {content.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center p-4 border-b border-slate-200 last:border-0 hover:bg-white transition-colors">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
                                <span className="text-slate-700 font-medium">{doc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicePage;
