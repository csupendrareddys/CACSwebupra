'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import { X } from 'lucide-react';
import OTPModal from '../modals/OTPModal';

const Login = ({ auth, setUser, isDemoMode }) => {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [authError, setAuthError] = useState('');
    const [showOTPModal, setShowOTPModal] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError('');

        if (!auth) {
            // Demo mode or fallback
            // const demoUser = { name: name || "Demo User", email: email, isPartner: false };
            // setUser(demoUser);
            // Persist demo user if needed or just redirect
            router.push('/dashboard');
            return;
        }

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                setUser({ name: name, email: email, uid: userCredential.user.uid });
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                setUser({ name: userCredential.user.displayName || "User", email: userCredential.user.email, uid: userCredential.user.uid });
            }
            router.push('/dashboard');
        } catch (error) {
            if (error.code?.includes('api-key')) {
                // Fallback to demo mode
                const demoUser = { name: name || "Demo User", email: email, isPartner: false };
                setUser(demoUser);
                router.push('/dashboard');
            } else {
                setAuthError(error.message.replace("Firebase: ", ""));
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-inter">
            {showOTPModal && <OTPModal onClose={() => setShowOTPModal(false)} />}
            <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl border border-gray-100 relative">
                <button onClick={() => router.push('/')} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
                    <p className="text-slate-500 mt-2">{isSignUp ? "Sign up to get started" : "Sign in to access your dashboard"}</p>
                    {isDemoMode && <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded">Demo Mode Active</p>}
                </div>
                {authError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{authError}</div>}
                <form onSubmit={handleAuth} className="space-y-6">
                    {isSignUp && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input type="text" required className="w-full px-5 py-3 border border-gray-200 rounded-xl" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input type="email" required className="w-full px-5 py-3 border border-gray-200 rounded-xl" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <input type="password" required className="w-full px-5 py-3 border border-gray-200 rounded-xl" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700">{isSignUp ? "Sign Up" : "Login"}</button>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 font-bold">{isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
