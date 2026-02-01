'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Calendar, Loader2, LogOut } from 'lucide-react';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/me');
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }
            const data = await res.json();
            setProfile(data.user);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
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
                            <h1 className="text-xl font-bold text-white">Profile Settings</h1>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                ) : profile ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Profile Card */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">
                                        {profile.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                        {profile.role}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p className="text-white">{profile.email}</p>
                                    </div>
                                </div>

                                {profile.phone && (
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                                        <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Phone</p>
                                            <p className="text-white">{profile.phone}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                                    <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Member Since</p>
                                        <p className="text-white">
                                            {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400">Failed to load profile</p>
                    </div>
                )}
            </main>
        </div>
    );
}
