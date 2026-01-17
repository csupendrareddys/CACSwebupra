'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash, CheckCircle } from 'lucide-react';

export default function ServiceManagement() {
    const [services, setServices] = useState<any[]>([]);
    const [newService, setNewService] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/admin/services');
            const data = await res.json();
            if (data.services) setServices(data.services);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newService.trim()) return;

        try {
            const res = await fetch('/api/admin/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document_type: newService, is_active: true })
            });

            if (res.ok) {
                setNewService("");
                fetchServices();
            }
        } catch (error) {
            alert('Failed to add service');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this service?')) return;
        try {
            const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchServices();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    if (loading) return <div>Loading services...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Service Catalog</h2>

            <form onSubmit={handleAdd} className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Enter new service name (e.g. Trademark Filing)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
                <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Service
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <div key={service.document_id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{service.document_type}</h3>
                                <p className="text-xs text-gray-500">{service.state === 'All India' ? 'Global' : service.state}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(service.document_id)}
                            className="text-gray-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
            {services.length === 0 && (
                <p className="text-gray-500 text-center py-8">No services found. Add one above.</p>
            )}
        </div>
    );
}
