'use client';

import { useState, useEffect, useCallback } from 'react';

interface StatusUpdate {
    orderId: string;
    status: string;
    paymentStatus: string;
    service: string;
    updatedAt: string;
}

interface UseOrderPollingOptions {
    enabled?: boolean;
    interval?: number; // in milliseconds
    onUpdate?: (updates: StatusUpdate[]) => void;
}

export function useOrderPolling(options: UseOrderPollingOptions = {}) {
    const { enabled = true, interval = 30000, onUpdate } = options;
    const [updates, setUpdates] = useState<StatusUpdate[]>([]);
    const [lastCheck, setLastCheck] = useState<string>(new Date().toISOString());

    const checkForUpdates = useCallback(async () => {
        try {
            const res = await fetch(`/api/orders/status?since=${encodeURIComponent(lastCheck)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.updates && data.updates.length > 0) {
                    setUpdates(data.updates);
                    onUpdate?.(data.updates);
                }
                setLastCheck(data.timestamp);
            }
        } catch (error) {
            console.error('Failed to check for updates:', error);
        }
    }, [lastCheck, onUpdate]);

    useEffect(() => {
        if (!enabled) return;

        // Initial check
        checkForUpdates();

        // Set up polling interval
        const intervalId = setInterval(checkForUpdates, interval);

        return () => clearInterval(intervalId);
    }, [enabled, interval, checkForUpdates]);

    return { updates, lastCheck, checkNow: checkForUpdates };
}
