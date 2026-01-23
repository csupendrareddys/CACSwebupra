'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { StartupLanding } from '@/components/views/CategoryLandings';
import { useOrderStore } from '@/store/orderStore';

export default function StartupPage() {
    const { user } = useOrderStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <MainLayout user={user}>
            <StartupLanding />
        </MainLayout>
    );
}
