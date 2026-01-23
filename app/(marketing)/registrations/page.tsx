'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { RegistrationsLanding } from '@/components/views/CategoryLandings';
import { useOrderStore } from '@/store/orderStore';

export default function RegistrationsPage() {
    const { user } = useOrderStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <MainLayout user={user}>
            <RegistrationsLanding />
        </MainLayout>
    );
}
