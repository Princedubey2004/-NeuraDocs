import React from 'react';

const UserPresence = ({ activeUsers }) => {
    return (
        <div className="flex items-center -space-x-2">
            {activeUsers.slice(0, 5).map((u) => (
                <div 
                    key={u.socketId}
                    title={u.name}
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: u.color }}
                >
                    {u.name.charAt(0).toUpperCase()}
                </div>
            ))}
            {activeUsers.length > 5 && (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-[10px] font-bold border-2 border-white">
                    +{activeUsers.length - 5}
                </div>
            )}
        </div>
    );
};

export default UserPresence;
