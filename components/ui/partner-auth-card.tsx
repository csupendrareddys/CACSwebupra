'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight, Loader2, User, Phone, Briefcase } from 'lucide-react';
import { cn } from "@/lib/utils"

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

function Select({ className, ...props }: React.ComponentProps<"select">) {
    return (
        <div className="relative">
            <select
                data-slot="select"
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm appearance-none",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    "bg-white/5 border-white/10 text-white", // Custom dark theme styles
                    className
                )}
                {...props}
            />
            <div className="absolute right-3 top-2.5 pointer-events-none text-gray-500">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>

    )
}

export function Component() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Login State
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Signup State
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [profession, setProfession] = useState("");
    const [otherProfession, setOtherProfession] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 3D Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!isLogin && signupPassword !== confirmPassword) {
            alert("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        const endpoint = isLogin ? '/api/partner-login' : '/api/partner-signup';
        const payload = isLogin
            ? { email: loginEmail, password: loginPassword }
            : { fullName, phone, email: signupEmail, profession, otherProfession, password: signupPassword };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    window.location.href = '/dashboard';
                } else {
                    alert("Registration successful! Please login.");
                    toggleMode();
                }
            } else {
                alert(data.error || 'Authentication failed');
            }
        } catch (error) {
            console.error('Partner Auth Error:', error);
            alert('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center py-10" onMouseMove={handleMouseMove}>
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />
            <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />

            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative z-10 w-full max-w-md"
            >
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

                    <div className="relative z-20">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                                {isLogin ? "Partner Login" : "Partner Registration"}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {isLogin ? "Welcome back! Please access your account." : "Join our network of professionals."}
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                            <Input
                                                placeholder="Full Name"
                                                type="text"
                                                required
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                            <Input
                                                placeholder="Phone Number"
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                            <Select
                                                required
                                                value={profession}
                                                onChange={(e) => setProfession(e.target.value)}
                                                className="pl-10 w-full bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                                            >
                                                <option value="" disabled className="text-gray-500 bg-black">Select Profession</option>
                                                <option value="Chartered Accountant" className="bg-black">Chartered Accountant</option>
                                                <option value="Company Secretary" className="bg-black">Company Secretary</option>
                                                <option value="Lawyer" className="bg-black">Lawyer</option>
                                                <option value="Other" className="bg-black">Other</option>
                                            </Select>
                                        </div>
                                    </div>
                                    {profession === "Other" && (
                                        <div className="space-y-2">
                                            <div className="relative group">
                                                <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                                <Input
                                                    placeholder="Specify Profession"
                                                    type="text"
                                                    required
                                                    value={otherProfession}
                                                    onChange={(e) => setOtherProfession(e.target.value)}
                                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="space-y-2">
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                    <Input
                                        placeholder="Email address"
                                        type="email"
                                        required
                                        value={isLogin ? loginEmail : signupEmail}
                                        onChange={(e) => isLogin ? setLoginEmail(e.target.value) : setSignupEmail(e.target.value)}
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                    <Input
                                        placeholder="Password"
                                        type={isLogin ? (showLoginPassword ? "text" : "password") : (showSignupPassword ? "text" : "password")}
                                        required
                                        value={isLogin ? loginPassword : signupPassword}
                                        onChange={(e) => isLogin ? setLoginPassword(e.target.value) : setSignupPassword(e.target.value)}
                                        className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => isLogin ? setShowLoginPassword(!showLoginPassword) : setShowSignupPassword(!showSignupPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {(isLogin ? showLoginPassword : showSignupPassword) ? <EyeClosed className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                        <Input
                                            placeholder="Confirm Password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeClosed className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center space-x-2 cursor-pointer text-gray-400 hover:text-white transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/50"
                                        />
                                        <span>Remember me</span>
                                    </label>
                                    <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-purple-900/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            {isLogin ? "Sign In" : "Create Account"}
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-400">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={toggleMode}
                                className="text-white hover:text-purple-400 transition-colors font-medium hover:underline focus:outline-none"
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
