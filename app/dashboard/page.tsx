'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, User, Briefcase, Shield, Settings, FileText, Activity, Layers, Users } from 'lucide-react';

// Import Admin Components
import UserManagement from '@/components/admin/UserManagement';
import ServiceManagement from '@/components/admin/ServiceManagement';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, users, services

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        router.push('/');
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    if (!user) return null;

    const isAdmin = user.role === 'Super_Admin' || user.role === 'Sub_Admin';

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
                                <span className="text-gray-300">{user.role.replace('_', ' ')}</span>
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
                            Welcome back, {user.name}
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
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {isAdmin ? (
                    // Admin View with Tabs
                    <div>
                        {activeTab === 'overview' && (
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
                        {activeTab === 'users' && <UserManagement />}
                        {activeTab === 'services' && <ServiceManagement />}
                    </div>
                ) : (
                    // Standard User/Partner View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DashboardCard
                            title="Profile Settings"
                            description="Manage your personal information and security."
                            icon={<Settings className="h-6 w-6 text-purple-400" />}
                            delay={0.1}
                        />

                        {user.role === 'Service_reciver' && (
                            <>
                                <DashboardCard
                                    title="My Requests"
                                    description="Track the status of your document requests."
                                    icon={<FileText className="h-6 w-6 text-blue-400" />}
                                    delay={0.2}
                                />
                                <DashboardCard
                                    title="Book New Service"
                                    description="Browse and request new legal services."
                                    icon={<Activity className="h-6 w-6 text-green-400" />}
                                    delay={0.3}
                                />
                            </>
                        )}

                        {user.role === 'Service_provider' && (
                            <>
                                <DashboardCard
                                    title="Available Jobs"
                                    description="View and accept new service requests."
                                    icon={<Briefcase className="h-6 w-6 text-blue-400" />}
                                    delay={0.2}
                                />
                                <DashboardCard
                                    title="Earnings & Payouts"
                                    description="Track your income and payment history."
                                    icon={<Activity className="h-6 w-6 text-green-400" />}
                                    delay={0.3}
                                />
                                <DashboardCard
                                    title="Verification Status"
                                    description={`Current Status: ${user.status || 'PENDING'}`}
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

function DashboardCard({ title, description, icon, delay }: { title: string, description: string, icon: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
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
