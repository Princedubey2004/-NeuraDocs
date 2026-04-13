import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
    return (
        <div className={`flex items-center justify-center ${fullScreen ? 'h-screen bg-gray-50' : 'p-4'}`}>
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
    );
};

export default Loader;
