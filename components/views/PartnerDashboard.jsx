import React from 'react';
import { Bell, Briefcase as BriefcaseIcon, UploadCloud } from 'lucide-react';
import { SkeletonDashboard } from '../common/SkeletonLoader';
import { SERVICE_PROFESSION_MAP } from '../../data/constants';
import { useOrderStore } from '../../store/orderStore';

const PartnerDashboard = () => {
    const { user, orders, updateOrderStatus, logout } = useOrderStore();

    // Safety check if user is not loaded
    if (!user) return null;
    // Filter available jobs based on partner profession
    // e.g. If partner is CA, they see CA jobs.
    const myProfession = user.profession || "CA";

    const availableJobs = orders ? orders.filter(o =>
        o.status === 'Pending Allocation' &&
        SERVICE_PROFESSION_MAP[o.service]?.includes(myProfession)
    ) : [];

    const myActiveJobs = orders ? orders.filter(o => o.assignedPartner === user.name && o.status === 'In Progress') : [];
    // const myCompletedJobs = orders ? orders.filter(o => o.assignedPartner === user.name && o.status === 'Completed') : [];

    return (
        <div className="min-h-screen bg-slate-50 flex font-inter">
            {/* Partner Sidebar */}
            <div className="w-72 bg-purple-900 text-white hidden md:flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-purple-800">
                    <div className="flex items-center space-x-3">
                        <span className="font-bold text-xl tracking-tight text-white">PARTNER PANEL</span>
                    </div>
                    <p className="text-xs text-purple-300 mt-1">{user.name} ({myProfession})</p>
                </div>
                <div className="p-6"><button onClick={logout} className="text-white bg-purple-800 px-4 py-2 rounded">Logout</button></div>
            </div>

            <main className="flex-1 overflow-y-auto p-10">
                {!orders ? <SkeletonDashboard /> : (
                    <>
                        <h1 className="text-3xl font-bold mb-8 text-slate-800">
                            Workstation {user.status === 'Pending Verification' && <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full ml-3">⚠️ Verification Pending</span>}
                        </h1>

                        {user.status === 'Pending Verification' && (
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded shadow-sm">
                                <h3 className="font-bold text-amber-800">Account Under Review</h3>
                                <p className="text-amber-700 text-sm mt-1">
                                    Thanks for joining, {user.name}! Your profile (Membership: {user.membershipNumber}) is currently being verified by our admin team.
                                    You can view available jobs but cannot accept them until verified.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Available Jobs Column */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-slate-700 flex items-center"><Bell className="w-5 h-5 mr-2" /> New Opportunities</h2>
                                <div className="space-y-4">
                                    {availableJobs.length === 0 && <p className="text-slate-400 italic">No new jobs matching your profile.</p>}
                                    {availableJobs.map((job, i) => (
                                        <div key={i} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                                            <h4 className="font-bold text-lg">{job.service}</h4>
                                            <p className="text-sm text-slate-500 mb-4">Client: {job.fullName}</p>
                                            <button
                                                disabled={user.status === 'Pending Verification'}
                                                onClick={() => updateOrderStatus(job.id, 'In Progress', user.name)}
                                                className={`w-full py-2 rounded-lg font-bold transition-all ${user.status === 'Pending Verification'
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                            >
                                                {user.status === 'Pending Verification' ? 'Verification Required' : 'Accept & Start'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active Jobs Column */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-slate-700 flex items-center"><BriefcaseIcon className="w-5 h-5 mr-2" /> My Active Jobs</h2>
                                <div className="space-y-4">
                                    {myActiveJobs.length === 0 && <p className="text-slate-400 italic">You have no active jobs.</p>}
                                    {myActiveJobs.map((job, i) => (
                                        <div key={i} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                                            <h4 className="font-bold text-lg">{job.service}</h4>
                                            <div className="my-4 bg-slate-50 p-3 rounded text-xs text-slate-600">
                                                <p className="font-bold mb-1">Documents Uploaded by Client:</p>
                                                <ul className="list-disc pl-4">
                                                    {job.documents?.map((d, k) => <li key={k}>{d}</li>)}
                                                </ul>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    updateOrderStatus(job.id, 'Completed');
                                                    alert("Work submitted successfully!");
                                                }}
                                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center"
                                            >
                                                <UploadCloud className="w-4 h-4 mr-2" /> Submit Completed Work
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default PartnerDashboard;
