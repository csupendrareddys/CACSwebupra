'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Partner {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    phone: string | null;
    profession: string;
    otherProfession: string | null;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
    documentsUrl: string | null;
    rating: number | null;
    createdAt: string;
}

export default function AdminPartnersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('PENDING');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Redirect if not admin
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/dashboard');
        }
    }, [session, status, router]);

    // Fetch partners
    useEffect(() => {
        async function fetchPartners() {
            setLoading(true);
            try {
                const url = filter ? `/api/admin/partners?status=${filter}` : '/api/admin/partners';
                const res = await fetch(url);
                const data = await res.json();
                if (res.ok) {
                    setPartners(data.partners);
                }
            } catch (error) {
                console.error('Failed to fetch partners:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPartners();
    }, [filter]);

    async function updateVerification(partnerId: string, newStatus: string) {
        setActionLoading(partnerId);
        try {
            const res = await fetch(`/api/admin/partners/${partnerId}/verify`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Refresh the list
                setPartners(prev => prev.filter(p => p.id !== partnerId));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update status');
            }
        } catch (error) {
            console.error('Failed to update verification:', error);
            alert('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        VERIFIED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
        SUSPENDED: 'bg-gray-100 text-gray-800'
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
                    <p className="text-gray-600 mt-2">Review and approve partner applications</p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        {['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${filter === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Partners Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Partner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Profession
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Documents
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applied
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {partners.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No {filter.toLowerCase()} partners found
                                    </td>
                                </tr>
                            ) : (
                                partners.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {partner.fullName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {partner.email}
                                                </div>
                                                {partner.phone && (
                                                    <div className="text-sm text-gray-500">
                                                        {partner.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {partner.profession}
                                            {partner.otherProfession && ` (${partner.otherProfession})`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[partner.verificationStatus]}`}>
                                                {partner.verificationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {partner.documentsUrl ? (
                                                <a
                                                    href={partner.documentsUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    View Documents →
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">No documents</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(partner.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {partner.verificationStatus === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => updateVerification(partner.id, 'VERIFIED')}
                                                        disabled={actionLoading === partner.id}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                    >
                                                        {actionLoading === partner.id ? '...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={() => updateVerification(partner.id, 'REJECTED')}
                                                        disabled={actionLoading === partner.id}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                    >
                                                        {actionLoading === partner.id ? '...' : 'Reject'}
                                                    </button>
                                                </>
                                            )}
                                            {partner.verificationStatus === 'VERIFIED' && (
                                                <button
                                                    onClick={() => updateVerification(partner.id, 'SUSPENDED')}
                                                    disabled={actionLoading === partner.id}
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                                                >
                                                    {actionLoading === partner.id ? '...' : 'Suspend'}
                                                </button>
                                            )}
                                            {(partner.verificationStatus === 'REJECTED' || partner.verificationStatus === 'SUSPENDED') && (
                                                <button
                                                    onClick={() => updateVerification(partner.id, 'VERIFIED')}
                                                    disabled={actionLoading === partner.id}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                    {actionLoading === partner.id ? '...' : 'Reinstate'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
