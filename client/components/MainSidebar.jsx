import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { 
    Plus, 
    FileText, 
    Settings, 
    LogOut, 
    Search,
    ChevronRight
} from 'lucide-react';

const MainSidebar = () => {
    const [documents, setDocuments] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const { data } = await api.get('/documents');
                setDocuments(data.data);
            } catch (err) {
                console.error('Failed to load sidebar docs');
            }
        };
        fetchDocs();
    }, []);

    const createNewDoc = async () => {
        if (isCreating) return;
        setIsCreating(true);
        try {
            const { data } = await api.post('/documents', { title: 'Untitled Document' });
            navigate(`/document/${data.data._id}`);
        } catch (err) {
            console.error('Failed');
            setIsCreating(false);
        }
    };

    const isSettings = location.pathname === '/settings';

    return (
        <aside className="w-72 bg-[#fbfbfa] border-r border-gray-100 flex flex-col h-full z-20">
            <div className="p-4 flex items-center justify-between mb-4">
                <div 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-200/50 cursor-pointer transition-all group border border-transparent hover:border-gray-200/50"
                >
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-lg shadow-indigo-100 flex items-center justify-center text-white text-xs font-black">
                        {user?.name?.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-800 truncate">{user?.name}'s Space</span>
                </div>
            </div>

            <div className="px-5 mb-8">
                <div className="relative group">
                    <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search documents..." 
                        className="w-full bg-gray-200/40 border-none rounded-xl py-2.5 pl-10 text-xs placeholder-gray-400 focus:ring-2 focus:ring-indigo-50 transition-all font-bold tracking-tight"
                    />
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 custom-scrollbar">
                <button 
                    onClick={createNewDoc}
                    disabled={isCreating}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 text-gray-600 text-xs font-bold transition-all group mb-4"
                >
                    <Plus className="h-4 w-4 text-indigo-500 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create Blank Page</span>
                </button>

                <div className="pt-2 pb-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Workspace</div>
                
                {documents.map(doc => {
                    const isActive = location.pathname === `/document/${doc._id}`;
                    return (
                        <button 
                            key={doc._id}
                            onClick={() => navigate(`/document/${doc._id}`)}
                            className={`relative flex items-center gap-3 w-full px-4 py-2 rounded-xl border-l-[3px] transition-all group ${
                                isActive 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-500 font-bold' 
                                : 'border-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <FileText className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}`} />
                            <span className="truncate flex-1 text-left text-sm">{doc.title}</span>
                            <ChevronRight className={`h-3 w-3 transition-all ${isActive ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto space-y-1 bg-gray-50/50">
                <button 
                    onClick={() => navigate('/settings')}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSettings 
                        ? 'bg-black text-white' 
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                >
                    <Settings className={`h-4 w-4 ${isSettings ? 'text-indigo-400' : ''}`} />
                    <span>Settings</span>
                </button>
                <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-3 w-full px-4 py-2 rounded-xl hover:bg-red-50 text-red-500 text-xs font-bold transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    );
};

export default MainSidebar;
