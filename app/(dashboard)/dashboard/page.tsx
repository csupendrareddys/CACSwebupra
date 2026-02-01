'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, User, Briefcase, Shield, Settings, FileText, Activity, Layers, Users, Loader2, TrendingUp, Clock, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';

// Import Admin Components
import UserManagement from '@/components/admin/UserManagement';
import ServiceManagement from '@/components/admin/ServiceManagement';
import OrderManagement from '@/components/admin/OrderManagement';

// Define User Interface
interface UserData {
    id: string;
    email: string;
    role: 'CLIENT' | 'PARTNER' | 'ADMIN';
    name?: string;
    status?: string;
    serviceProvider?: {
        verificationStatus: string;
    } | null;
}

interface AdminStats {
    users: { total: number; clients: number; partners: number };
    partners: { pending: number; verified: number };
    orders: { total: number; pending: number; completed: number };
    services: { total: number; active: number };
    revenue: { total: number };
    recent: {
        orders: Array<{ id: string; service: string; customer: string; status: string; createdAt: string }>;
        users: Array<{ id: string; email: string; role: string; status: string; createdAt: string }>;
    };
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (!res.ok) {
                    throw new Error('Not authenticated');
                }
                const data = await res.json();
                setUser(data.user);
                
                // If admin, fetch stats
                if (data.user.role === 'ADMIN') {
                    fetchStats();
                }
            } catch (error) {
                console.error("Auth check failed", error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!user) {
        // Should have been redirected by middleware or useEffect, but safe return
        return null;
    }

    const isAdmin = user.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-purple-500/30">
            {/* Navbar */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                                C
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                CACS<span className="text-purple-400">Upra</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-gray-300">{user.role || 'User'}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-2">
                            Welcome back, {user.name || user.email}
                        </h1>
                        <p className="text-gray-400">Dashboard</p>
                    </div>

                    {/* Admin Tabs */}
                    {isAdmin && (
                        <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Users className="h-4 w-4" /> Users
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'services' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Layers className="h-4 w-4" /> Services
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <FileText className="h-4 w-4" /> Orders
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {isAdmin ? (
                    // Admin View with Tabs
                    <div>
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {/* Stats Grid */}
                                {statsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                                    </div>
                                ) : stats ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <StatCard
                                                title="Total Users"
                                                value={stats.users.total}
                                                subtitle={`${stats.users.clients} Clients, ${stats.users.partners} Partners`}
                                                icon={<Users className="h-6 w-6 text-blue-400" />}
                                                color="blue"
                                            />
                                            <StatCard
                                                title="Total Orders"
                                                value={stats.orders.total}
                                                subtitle={`${stats.orders.pending} Pending, ${stats.orders.completed} Completed`}
                                                icon={<FileText className="h-6 w-6 text-green-400" />}
                                                color="green"
                                            />
                                            <StatCard
                                                title="Active Services"
                                                value={stats.services.active}
                                                subtitle={`of ${stats.services.total} total services`}
                                                icon={<Layers className="h-6 w-6 text-purple-400" />}
                                                color="purple"
                                            />
                                            <StatCard
                                                title="Revenue"
                                                value={`₹${stats.revenue.total.toLocaleString()}`}
                                                subtitle="Total collected"
                                                icon={<IndianRupee className="h-6 w-6 text-yellow-400" />}
                                                color="yellow"
                                            />
                                        </div>

                                        {/* Pending Actions */}
                                        {stats.partners.pending > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                                                    <span className="text-yellow-200">
                                                        <strong>{stats.partners.pending}</strong> partner(s) awaiting verification
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => setActiveTab('users')}
                                                    className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                                                >
                                                    Review Now →
                                                </button>
                                            </motion.div>
                                        )}

                                        {/* Recent Activity */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Recent Orders */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                                            >
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-purple-400" />
                                                    Recent Orders
                                                </h3>
                                                {stats.recent.orders.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {stats.recent.orders.map((order) => (
                                                            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                                <div>
                                                                    <p className="text-white text-sm font-medium">{order.service}</p>
                                                                    <p className="text-gray-400 text-xs">{order.customer}</p>
                                                                </div>
                                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                                    order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                                                                    order.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' :
                                                                    order.status === 'PAYMENT_COMPLETED' ? 'bg-purple-500/20 text-purple-400' :
                                                                    'bg-yellow-500/20 text-yellow-400'
                                                                }`}>
                                                                    {order.status.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No orders yet</p>
                                                )}
                                            </motion.div>

                                            {/* Recent Users */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                                            >
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                    <User className="h-5 w-5 text-blue-400" />
                                                    Recent Signups
                                                </h3>
                                                {stats.recent.users.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {stats.recent.users.map((u) => (
                                                            <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                                <div>
                                                                    <p className="text-white text-sm font-medium">{u.email}</p>
                                                                    <p className="text-gray-400 text-xs">
                                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                                    u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                                                                    u.role === 'PARTNER' ? 'bg-blue-500/20 text-blue-400' :
                                                                    'bg-gray-500/20 text-gray-400'
                                                                }`}>
                                                                    {u.role}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No users yet</p>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <DashboardCard
                                                title="Manage Users"
                                                description="View and manage all users, verify partners"
                                                icon={<Users className="h-6 w-6 text-blue-400" />}
                                                delay={0.1}
                                                onClick={() => setActiveTab('users')}
                                            />
                                            <DashboardCard
                                                title="Manage Services"
                                                description="Add, edit, or remove service offerings"
                                                icon={<Layers className="h-6 w-6 text-purple-400" />}
                                                delay={0.2}
                                                onClick={() => setActiveTab('services')}
                                            />
                                            <DashboardCard
                                                title="Partner Approvals"
                                                description={`${stats.partners.pending} pending, ${stats.partners.verified} verified`}
                                                icon={<Shield className="h-6 w-6 text-green-400" />}
                                                delay={0.3}
                                                onClick={() => router.push('/admin/partners')}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <DashboardCard
                                            title="System Health"
                                            description="All systems operational."
                                            icon={<Activity className="h-6 w-6 text-green-400" />}
                                            delay={0.1}
                                        />
                                        <DashboardCard
                                            title="Security Logs"
                                            description="No recent threats detected."
                                            icon={<Shield className="h-6 w-6 text-blue-400" />}
                                            delay={0.2}
                                        />
                                        <div onClick={() => setActiveTab('users')} className="cursor-pointer">
                                            <DashboardCard
                                                title="Pending Approvals"
                                                description="Check User Management tab."
                                                icon={<User className="h-6 w-6 text-yellow-400" />}
                                                delay={0.3}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'users' && <UserManagement />}
                        {activeTab === 'services' && <ServiceManagement />}
                        {activeTab === 'orders' && <OrderManagement />}
                    </div>
                ) : (
                    // Standard User/Partner View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DashboardCard
                            title="Profile Settings"
                            description="Manage your personal information and security."
                            icon={<Settings className="h-6 w-6 text-purple-400" />}
                            delay={0.1}
                            onClick={() => router.push('/dashboard/profile')}
                        />

                        {user.role === 'CLIENT' && (
                            <>
                                <DashboardCard
                                    title="My Orders"
                                    description="Track the status of your service requests."
                                    icon={<FileText className="h-6 w-6 text-blue-400" />}
                                    delay={0.2}
                                    onClick={() => router.push('/dashboard/orders')}
                                />
                                <DashboardCard
                                    title="Book New Service"
                                    description="Browse and request new legal services."
                                    icon={<Activity className="h-6 w-6 text-green-400" />}
                                    delay={0.3}
                                    onClick={() => router.push('/')}
                                />
                            </>
                        )}

                        {user.role === 'PARTNER' && (
                            <>
                                <DashboardCard
                                    title="Available Jobs"
                                    description="View and accept new service requests."
                                    icon={<Briefcase className="h-6 w-6 text-blue-400" />}
                                    delay={0.2}
                                    onClick={() => router.push('/dashboard/jobs')}
                                />
                                <DashboardCard
                                    title="Earnings & Payouts"
                                    description="Track your income and payment history."
                                    icon={<Activity className="h-6 w-6 text-green-400" />}
                                    delay={0.3}
                                    onClick={() => router.push('/dashboard/earnings')}
                                />
                                <DashboardCard
                                    title="Verification Status"
                                    description={`Current Status: ${user?.status || 'PENDING'}`}
                                    icon={<Shield className="h-6 w-6 text-yellow-400" />}
                                    delay={0.4}
                                />
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

function DashboardCard({ title, description, icon, delay, onClick }: { title: string, description: string, icon: React.ReactNode, delay: number, onClick?: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            onClick={onClick}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/10 group cursor-pointer h-full"
        >
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </motion.div>
    );
}

function StatCard({ title, value, subtitle, icon, color }: { title: string, value: string | number, subtitle: string, icon: React.ReactNode, color: string }) {
    const colorClasses: Record<string, string> = {
        blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
        green: 'from-green-500/20 to-green-600/10 border-green-500/30',
        purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
        yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
        red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 hover:scale-105`}
        >
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-400 text-sm font-medium">{title}</h4>
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-gray-400 text-xs">{subtitle}</p>
        </motion.div>
    );
}

