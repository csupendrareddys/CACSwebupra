'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import HomeLanding from '@/components/pages/HomeLanding';
import { useOrderStore } from '@/store/orderStore';

export default function Page() {
  const { user } = useOrderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial load

  return (
    <MainLayout user={user}>
      <HomeLanding />
    </MainLayout>
  );
}
