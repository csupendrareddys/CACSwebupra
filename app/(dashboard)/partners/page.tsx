'use client';

import React, { useEffect, useState } from 'react';
import PartnersLogin from '@/components/views/PartnersLogin';
import PartnerDashboard from '@/components/views/PartnerDashboard';
import { useOrderStore } from '@/store/orderStore';
import { useRouter } from 'next/navigation';

export default function PartnersPage() {
    const { user } = useOrderStore();
    const [view, setView] = useState('login'); // default
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Redirect to login view if user logs out while in dashboard
    useEffect(() => {
        if (mounted && view === 'partnerDashboard' && !user) {
            setView('login');
        }
    }, [user, view, mounted]);

    if (!mounted) return null;

    if (view === 'partnerDashboard' && user) {
        return <PartnerDashboard />;
    }

    return (
        <PartnersLogin setView={setView} />
    );
}
