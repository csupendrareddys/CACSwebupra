import React from 'react';

const InfiniteGrid = () => {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            {/* Background Grid */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
                    backgroundSize: '40px 40px',
                }}
            ></div>

            {/* Moving Light Effect */}
            <div
                className="absolute inset-0 z-0 opacity-40 bg-gradient-to-tr from-blue-100/50 via-transparent to-transparent"
                style={{
                    animation: 'pulse 5s infinite alternate'
                }}
            ></div>
            <style>{`
         @keyframes pulse {
           0% { opacity: 0.3; transform: scale(1); }
           100% { opacity: 0.5; transform: scale(1.05); }
         }
       `}</style>
        </div>
    );
};

export default InfiniteGrid;
