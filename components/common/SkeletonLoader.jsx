import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-slate-200 rounded-md ${className}`}
            {...props}
        />
    );
};

export const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full">
        <Skeleton className="h-10 w-10 rounded-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
    </div>
);

export const SkeletonRow = ({ cols = 4 }) => (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100">
        {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-1/3' : 'w-1/6'}`} />
        ))}
    </div>
);

export const SkeletonDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
                    <Skeleton className="h-8 w-8 rounded-full mb-2" />
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex justify-between mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
            </div>
        </div>
    </div>
);

export default Skeleton;
