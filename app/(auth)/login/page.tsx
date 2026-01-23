'use client';

import React, { useEffect, useState } from 'react';
import Login from '@/components/views/Login';
import { useOrderStore } from '@/store/orderStore';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
    const { setUser } = useOrderStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Login auth={auth} setUser={setUser} isDemoMode={false} />
    );
}
