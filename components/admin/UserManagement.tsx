'use client';
import { useState, useEffect } from 'react';
import { Check, X, Shield, Lock, AlertTriangle, Loader2 } from 'lucide-react';

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async (userId: number, action: string) => {
        if (!confirm('Are you sure you want to perform this action?')) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action })
            });
            if (res.ok) fetchUsers();
            else alert('Action failed');
        } catch (error) {
            alert('Error performing action');
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">User Management</h2>

            <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Partner Info</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user.user_id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{user.first_name || user.username}</div>
                                    <div className="text-xs">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs border ${user.role === 'Super_Admin' ? 'border-red-500 text-red-400 bg-red-500/10' :
                                            user.role === 'Service_provider' ? 'border-blue-500 text-blue-400 bg-blue-500/10' :
                                                'border-gray-500 text-gray-400 bg-gray-500/10'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.user_status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {user.user_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.role === 'Service_provider' ? (
                                        <div className="flex flex-col gap-1">
                                            <span>{user.profession}</span>
                                            <span className={`text-xs ${user.verification_status === 'VERIFIED' ? 'text-green-500' : 'text-yellow-500'
                                                }`}>
                                                {user.verification_status}
                                            </span>
                                        </div>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {user.role === 'Service_provider' && user.verification_status === 'PENDING' && (
                                        <button
                                            onClick={() => handleAction(user.user_id, 'VERIFY_PARTNER')}
                                            className="text-green-400 hover:text-green-300 bg-green-900/20 px-3 py-1 rounded transition-colors"
                                            title="Verify Partner"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    )}
                                    {user.user_status === 'ACTIVE' && user.role !== 'Super_Admin' && (
                                        <button
                                            onClick={() => handleAction(user.user_id, 'BLOCK_USER')}
                                            className="text-red-400 hover:text-red-300 bg-red-900/20 px-3 py-1 rounded transition-colors"
                                            title="Block User"
                                        >
                                            <Lock className="h-4 w-4" />
                                        </button>
                                    )}
                                    {user.user_status === 'BLOCKED' && (
                                        <button
                                            onClick={() => handleAction(user.user_id, 'ACTIVATE_USER')}
                                            className="text-yellow-400 hover:text-yellow-300 bg-yellow-900/20 px-3 py-1 rounded transition-colors"
                                            title="Unblock User"
                                        >
                                            <Shield className="h-4 w-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
