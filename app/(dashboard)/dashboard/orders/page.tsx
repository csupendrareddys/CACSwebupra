'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

interface Order {
    id: string;
    service: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
}

export default function MyOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch orders');
            }
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors: Record<string, string> = {
        CREATED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        PAYMENT_PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        PAYMENT_COMPLETED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        PROCESSING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
        CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
        REFUNDED: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };

    const statusIcons: Record<string, React.ReactNode> = {
        CREATED: <Clock className="h-4 w-4" />,
        PAYMENT_PENDING: <Clock className="h-4 w-4" />,
        PAYMENT_COMPLETED: <CheckCircle className="h-4 w-4" />,
        PROCESSING: <RefreshCw className="h-4 w-4 animate-spin" />,
        COMPLETED: <CheckCircle className="h-4 w-4" />,
        CANCELLED: <XCircle className="h-4 w-4" />,
        REFUNDED: <XCircle className="h-4 w-4" />,
    };

    return (
        <div className="min-h-screen bg-black text-gray-100">
            {/* Header */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-xl font-bold text-white">My Orders</h1>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            title="Refresh"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="h-10 w-10 text-gray-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">No Orders Yet</h2>
                        <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Browse Services
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                            <Package className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{order.service}</h3>
                                            <p className="text-sm text-gray-400">
                                                Order ID: {order.id.slice(0, 8)}...
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${statusColors[order.status]}`}>
                                            {statusIcons[order.status]}
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
