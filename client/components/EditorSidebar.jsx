import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { FileText, Plus, Search, Home } from 'lucide-react';

const EditorSidebar = () => {
    const [documents, setDocuments] = useState([]);
    const { id: currentDocId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const { data } = await api.get('/documents');
                setDocuments(data.data);
            } catch (err) {
                console.error('Failed to load navigation docs');
            }
        };
        fetchDocs();
    }, []);

    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-100 flex flex-col h-full z-10 hidden lg:flex">
            <div className="p-4">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-gray-200 text-gray-600 text-sm transition-colors mb-4"
                >
                    <Home className="h-4 w-4" />
                    <span className="font-semibold">All Pages</span>
                </button>

                <div className="relative mb-6">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-white border border-gray-200 rounded-md py-1.5 pl-8 text-xs focus:ring-1 focus:ring-indigo-100 focus:border-indigo-300"
                    />
                </div>

                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-3">Recent Documents</div>
                <div className="space-y-1">
                    {documents.slice(0, 15).map(doc => {
                        const isActive = doc._id === currentDocId;
                        return (
                            <button 
                                key={doc._id}
                                onClick={() => navigate(`/document/${doc._id}`)}
                                className={`group flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 border border-transparent ${
                                    isActive 
                                    ? 'bg-white text-indigo-700 font-bold shadow-sm border-gray-100 ring-1 ring-black/5' 
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <div className={`flex items-center justify-center h-7 w-7 rounded-lg transition-colors ${
                                    isActive ? 'bg-indigo-600 shadow-indigo-100 shadow-lg' : 'bg-white group-hover:bg-indigo-50 border border-gray-100 group-hover:border-indigo-100'
                                }`}>
                                    <FileText className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'}`} />
                                </div>
                                <span className="truncate flex-1 text-left">{doc.title || 'Untitled'}</span>
                                {isActive && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-gray-100">
                <button 
                    onClick={async () => {
                        const { data } = await api.post('/documents', { title: 'Untitled Document' });
                        navigate(`/document/${data.data._id}`);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-gray-200 text-gray-600 text-sm transition-colors mb-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Page</span>
                </button>
                <button 
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-gray-200 text-gray-600 text-sm transition-colors"
                >
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default EditorSidebar;
