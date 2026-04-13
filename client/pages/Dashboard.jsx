import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import Loader from '../components/Loader';
import MainSidebar from '../components/MainSidebar';
import { 
    Plus, 
    FileText, 
    Clock, 
    PencilLine,
    ArrowRight,
    Inbox
} from 'lucide-react';

/**
 * Hey! This is the main dashboard where users see all their work.
 * I've tried to keep the code organized so it's easy to follow.
 */

const Dashboard = () => {
    // We'll store all the user's docs here
    const [userDocs, setUserDocs] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(true);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    // Helper to format that "2m ago" style text
    const getTimeAgo = (date) => {
        const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (diffInSeconds < 60) return "Just now";
        
        const mins = Math.floor(diffInSeconds / 60);
        if (mins < 60) return `${mins}m ago`;
        
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        
        return new Date(date).toLocaleDateString();
    };

    const loadWorkspace = async () => {
        try {
            const response = await api.get('/documents');
            setUserDocs(response.data.data);
        } catch (err) {
            console.error('Oops, couldnt load your documents:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadWorkspace();
    }, []);

    const handleCreatePage = async () => {
        if (isCreatingNew) return;
        
        setIsCreatingNew(true);
        try {
            const { data } = await api.post('/documents', { 
                title: 'New Document' 
            });
            // Jump straight into the new doc
            navigate(`/document/${data.data._id}`);
        } catch (err) {
            console.error('Failed to start a new page:', err);
            setIsCreatingNew(false);
        }
    };

    const handleRenameDoc = async (id, currentTitle) => {
        const requestedTitle = prompt('What should we call this?', currentTitle);
        if (requestedTitle && requestedTitle !== currentTitle) {
            try {
                await api.put(`/documents/${id}`, { title: requestedTitle });
                // Reload the list to show the new name
                loadWorkspace();
            } catch (err) {
                alert('That didnt work. Maybe try again?');
            }
        }
    };

    if (isRefreshing) return <Loader fullScreen />;

    return (
        <div className="flex h-screen bg-white overflow-hidden font-sans">
            <MainSidebar />

            <main className="flex-1 flex flex-col overflow-y-auto bg-white custom-scrollbar">
                <header className="px-12 md:px-20 max-w-6xl w-full mx-auto pt-20 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Your Workspace</h1>
                    <p className="mt-4 text-lg text-gray-400 font-medium tracking-tight">Everything you've been working on.</p>
                </header>

                <div className="flex-1 px-12 md:px-20 max-w-6xl w-full mx-auto pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {/* The "New Page" Card */}
                        <div 
                            onClick={handleCreatePage}
                            className="group relative h-60 rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-gray-50/30 hover:bg-white hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center overflow-hidden"
                        >
                            <div className="h-16 w-16 rounded-3xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                                <Plus className="h-8 w-8" />
                            </div>
                            <span className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-indigo-600 transition-colors">Create Page</span>
                        </div>

                        {/* List of actual documents */}
                        {userDocs.map(doc => (
                            <div 
                                key={doc._id}
                                className="group relative h-60 rounded-[2.5rem] border border-transparent bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] hover:border-gray-100 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col"
                                onClick={() => navigate(`/document/${doc._id}`)}
                            >
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="h-14 w-14 rounded-[1.25rem] bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white group-hover:shadow-2xl group-hover:shadow-gray-300 transition-all duration-500">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleRenameDoc(doc._id, doc.title); }}
                                        className="p-2.5 rounded-full flex items-center justify-center text-gray-300 hover:text-black hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <PencilLine className="h-4 w-4" />
                                    </button>
                                </div>

                                <h3 className="mt-10 text-xl font-black text-gray-800 truncate group-hover:text-black tracking-tight">{doc.title}</h3>
                                
                                <div className="mt-auto flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                        <Clock className="h-3 w-3" />
                                        <span>{getTimeAgo(doc.updatedAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 bg-indigo-50 p-2 rounded-xl border border-indigo-100">
                                        <span>OPEN</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </div>
                                </div>

                                {/* Nice subtle glow on hover */}
                                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            </div>
                        ))}
                    </div>

                    {/* Show this if there are literally zero documents */}
                    {userDocs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 bg-gray-50/30 rounded-[4rem] border-2 border-dashed border-gray-100 mt-12 animate-in fade-in zoom-in duration-700">
                            <div className="h-24 w-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mb-8">
                                <Inbox className="h-10 w-10 text-gray-100" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your workspace is empty</h2>
                            <p className="text-gray-400 mt-3 text-sm font-bold uppercase tracking-widest">Start your first document to begin.</p>
                            <button 
                                onClick={handleCreatePage}
                                className="mt-10 bg-black text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-400 hover:scale-110 active:scale-95 transition-all"
                            >
                                Start Writing
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
