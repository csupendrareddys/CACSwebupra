'use client';
import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, User, Calendar, IndianRupee, RefreshCw } from 'lucide-react';

interface Order {
    id: string;
    service: string;
    customer: string;
    customerEmail: string;
    provider: string | null;
    status: string;
    paymentStatus: string;
    finalPrice: number | null;
    createdAt: string;
}

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (data.orders) setOrders(data.orders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        if (!confirm(`Update order status to ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            if (res.ok) fetchOrders();
            else alert('Failed to update status');
        } catch (error) {
            console.error('Update failed:', error);
            alert('Error updating order');
        }
    };

    const filteredOrders = filter === 'ALL' 
        ? orders 
        : orders.filter(o => o.status === filter);

    const statusColors: Record<string, string> = {
        CREATED: 'bg-gray-500/20 text-gray-400',
        PAYMENT_PENDING: 'bg-yellow-500/20 text-yellow-400',
        PAYMENT_COMPLETED: 'bg-purple-500/20 text-purple-400',
        PROCESSING: 'bg-blue-500/20 text-blue-400',
        COMPLETED: 'bg-green-500/20 text-green-400',
        CANCELLED: 'bg-red-500/20 text-red-400',
        REFUNDED: 'bg-orange-500/20 text-orange-400',
    };

    const paymentColors: Record<string, string> = {
        PENDING: 'text-yellow-400',
        SUCCESS: 'text-green-400',
        FAILED: 'text-red-400',
        REFUNDED: 'text-orange-400',
    };

    if (loading) return (
        <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-400">Loading orders...</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Order Management</h2>
                
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {['ALL', 'CREATED', 'PAYMENT_COMPLETED', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                filter === status 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-xs">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{orders.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-yellow-400 text-xs">Pending</p>
                    <p className="text-2xl font-bold text-yellow-400">
                        {orders.filter(o => ['CREATED', 'PAYMENT_PENDING'].includes(o.status)).length}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-blue-400 text-xs">Processing</p>
                    <p className="text-2xl font-bold text-blue-400">
                        {orders.filter(o => ['PAYMENT_COMPLETED', 'PROCESSING'].includes(o.status)).length}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-green-400 text-xs">Completed</p>
                    <p className="text-2xl font-bold text-green-400">
                        {orders.filter(o => o.status === 'COMPLETED').length}
                    </p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Service</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs text-purple-400">
                                            {order.id.slice(0, 8)}...
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-gray-500" />
                                            <span className="text-white font-medium">{order.service}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-white text-sm">{order.customer}</p>
                                            <p className="text-gray-500 text-xs">{order.customerEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs ${paymentColors[order.paymentStatus] || 'text-gray-400'}`}>
                                            {order.paymentStatus}
                                        </span>
                                        {order.finalPrice && (
                                            <p className="text-white text-xs mt-1">₹{order.finalPrice}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            {order.status === 'PAYMENT_COMPLETED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'PROCESSING')}
                                                    className="p-1.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                                    title="Start Processing"
                                                >
                                                    <Clock className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            {order.status === 'PROCESSING' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                                                    className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                                    title="Mark Completed"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            {!['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(order.status) && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                                    className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                    title="Cancel Order"
                                                >
                                                    <XCircle className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
