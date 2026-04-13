import React from 'react';
import { ChevronLeft, Sparkles, Save, Loader2, Share2 } from 'lucide-react';
import UserPresence from './UserPresence';

const Navbar = ({ 
    title, 
    onTitleChange, 
    onSave, 
    saving, 
    activeUsers, 
    onToggleAI, 
    onToggleShare,
    userName, 
    onBack 
}) => {
    return (
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-2.5 bg-white z-40 sticky top-0">
            <div className="flex items-center gap-4 flex-1">
                <button 
                    onClick={onBack} 
                    className="group rounded-lg p-2 hover:bg-gray-100 transition-all"
                    title="Back to Dashboard"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                </button>
                <div className="h-5 w-[1px] bg-gray-200 hidden sm:block"></div>
                <div className="flex flex-col flex-1 max-w-sm">
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        onBlur={onSave}
                        className="text-sm font-bold text-gray-800 focus:outline-none focus:ring-0 px-2 py-0.5 rounded hover:bg-gray-50 transition-colors w-full font-sans border-none"
                        placeholder="Untitled Document"
                    />
                    <div className="flex items-center gap-1.5 px-2">
                        {saving ? (
                            <>
                                <Loader2 className="h-2.5 w-2.5 animate-spin text-amber-500" />
                                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-tighter">Saving to cloud...</span>
                            </>
                        ) : (
                            <>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Changes saved</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <UserPresence activeUsers={activeUsers} />

                <div className="flex items-center gap-2 border-l border-gray-100 pl-4 ml-2">
                    <button 
                        onClick={onToggleShare}
                        className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-all text-xs font-bold border border-transparent hover:border-gray-200"
                        title="Share Document"
                    >
                        <Share2 className="h-3.5 w-3.5" />
                        SHARE
                    </button>
                    
                    <button 
                        onClick={onToggleAI}
                        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-bold shadow-lg shadow-gray-200"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        AI ASSISTANT
                    </button>
                </div>

                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-[10px] font-black uppercase ring-4 ring-gray-50 ml-2 shadow-inner border border-white">
                    {userName?.charAt(0) || 'U'}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
