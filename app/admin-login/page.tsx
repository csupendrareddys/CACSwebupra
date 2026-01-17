'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeClosed, ArrowRight, Loader2, Mail } from 'lucide-react';
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    )
}

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/login', { // Admin login typically uses same endpoint but checks role
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Verify this is an admin
                if (data.user.role === 'Super_Admin' || data.user.role === 'Sub_Admin') {
                    // Safe session in localStorage for demo
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    alert(`Admin Access Granted. Welcome ${data.user.name}`);
                    router.push('/dashboard');
                } else {
                    alert("Access Denied: You do not have administrator privileges.");
                }
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Admin Login Error:', error);
            alert('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center">
            {/* Darker, more serious gradient for Admin */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />

            {/* Red/Blue hint for Admin Security */}
            <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-blue-900/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[50vh] h-[50vh] bg-red-900/10 blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-6"
            >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-gray-400 text-sm">Secure access for system administrators</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <Input
                                    placeholder="Admin Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-black/50 border-white/10 text-white focus-visible:ring-blue-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <Input
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 bg-black/50 border-white/10 text-white focus-visible:ring-blue-500/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                                >
                                    {showPassword ? <EyeClosed className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-white text-black hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authenticate"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
