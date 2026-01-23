'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { TrademarkLanding } from '@/components/views/CategoryLandings';
import { useOrderStore } from '@/store/orderStore';

export default function TrademarkPage() {
    const { user } = useOrderStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <MainLayout user={user}>
            <TrademarkLanding />
        </MainLayout>
    );
}
