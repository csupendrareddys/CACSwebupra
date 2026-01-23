'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import ServicePage from '@/components/views/ServicePage';
import { useOrderStore } from '@/store/orderStore';

export default function DynamicServicePage() {
    const { user } = useOrderStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleBook = (data: any) => {
        console.log('Service booked:', data);
        // Handle booking logic here
    };

    return (
        <MainLayout user={user}>
            <ServicePage onBook={handleBook} />
        </MainLayout>
    );
}
