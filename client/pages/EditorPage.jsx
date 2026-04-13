import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useSocket } from '../hooks/useSocket';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'; 
import EditorSidebar from '../components/EditorSidebar';
import Editor from '../components/Editor';
import Loader from '../components/Loader';
import { X } from 'lucide-react';

const RemoteCursor = ({ quill, name, color, range }) => {
    const [bounds, setBounds] = useState(null);

    useEffect(() => {
        if (quill && range) {
            try {
                const b = quill.getBounds(range.index);
                setBounds(b);
            } catch (e) {
                // Ignore errors if range is invalid
            }
        }
    }, [quill, range]);

    if (!bounds) return null;

    return (
        <div 
            className="absolute z-30 pointer-events-none transition-all duration-100 ease-out"
            style={{ 
                top: bounds.top, 
                left: bounds.left, 
                height: bounds.height 
            }}
        >
            <div className="w-0.5 h-full relative" style={{ backgroundColor: color }}>
                <div 
                    className="absolute -top-4 left-0 px-1.5 py-0.5 rounded-sm text-[8px] font-black text-white whitespace-nowrap uppercase tracking-tighter shadow-sm"
                    style={{ backgroundColor: color }}
                >
                    {name}
                </div>
            </div>
        </div>
    );
};

const EditorPage = () => {
    const { id: documentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    
    const quillRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const autoSaveTimeoutRef = useRef(null);

    const { 
        activeUsers, 
        cursors,
        typingUsers, 
        messages,
        sendChanges, 
        sendCursorUpdate,
        saveContent, 
        sendTypingStatus,
        sendMessage
    } = useSocket(documentId, quillRef);

    useEffect(() => {
        setLoading(true);
        const fetchDocument = async () => {
            try {
                const { data } = await api.get(`/documents/${documentId}`);
                setDocument(data.data);
                setLoading(false);
            } catch (err) {
                navigate('/');
            }
        };
        fetchDocument();
    }, [documentId, navigate]);

    const debouncedSave = useCallback(() => {
        if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
        autoSaveTimeoutRef.current = setTimeout(async () => {
            if (!quillRef.current) return;
            setSaving(true);
            const content = quillRef.current.getEditor().getContents();
            saveContent(content);
            setTimeout(() => setSaving(false), 800);
        }, 3000);
    }, [saveContent]);

    const onTextChange = (content, delta, source) => {
        if (source !== 'user') return;
        sendChanges(delta);
        
        if (!typingTimeoutRef.current) sendTypingStatus(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false);
            typingTimeoutRef.current = null;
        }, 2000);

        debouncedSave();
    };

    const handleSelectionChange = useCallback((range) => {
        if (range) {
            sendCursorUpdate(range);
            if (range.length > 0) {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                    const text = quill.getText(range.index, range.length);
                    setSelectedText(text);
                }
            }
        }
    }, [sendCursorUpdate]);

    if (loading) return <Loader fullScreen />;

    return (
        <div className="flex h-screen flex-col bg-white overflow-hidden font-sans uppercase-none selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar 
                title={document.title}
                onTitleChange={(val) => setDocument(p => ({ ...p, title: val }))}
                onSave={debouncedSave}
                saving={saving}
                activeUsers={activeUsers}
                onToggleAI={() => setIsAIPanelOpen(!isAIPanelOpen)}
                onToggleShare={() => setIsShareModalOpen(true)}
                userName={user?.name}
                onBack={() => navigate('/')}
            />

            <div className="flex flex-1 relative overflow-hidden">
                <EditorSidebar />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 scrollbar-hide bg-[#fbfbfb] relative">
                    <div className="mx-auto max-w-5xl relative">
                        {/* Typing Indicator */}
                        <div className="absolute -top-12 left-0 flex flex-col gap-1.5 pointer-events-none">
                            {Object.entries(typingUsers).map(([id, name]) => (
                                <div key={id} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 transition-all">
                                    <div className="flex gap-1">
                                        <div className="h-1 w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="h-1 w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="h-1 w-1 bg-indigo-400 rounded-full animate-bounce" />
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50/50 px-2 py-0.5 rounded-full border border-indigo-100/50">
                                        {name} is typing...
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Editor 
                            ref={quillRef}
                            defaultValue={document.content}
                            onChange={onTextChange}
                            onSelectionChange={handleSelectionChange}
                        />

                        {/* Remote Cursors */}
                        {Object.entries(cursors).map(([userId, data]) => (
                            <RemoteCursor 
                                key={userId}
                                quill={quillRef.current?.getEditor()}
                                {...data}
                            />
                        ))}
                    </div>
                </main>

                <Sidebar 
                    isOpen={isAIPanelOpen}
                    onClose={() => setIsAIPanelOpen(false)}
                    selectedText={selectedText}
                    messages={messages}
                    onSendMessage={sendMessage}
                    onApplyChange={(suggestion) => {
                        const quill = quillRef.current?.getEditor();
                        const selection = quill.getSelection();
                        if (selection) {
                            quill.deleteText(selection.index, selection.length);
                            quill.insertText(selection.index, suggestion);
                        }
                    }}
                />
            </div>

            {isShareModalOpen && (
                <ShareModal 
                    isOpen={isShareModalOpen} 
                    onClose={() => setIsShareModalOpen(false)} 
                    documentId={documentId}
                />
            )}
        </div>
    );
};

const ShareModal = ({ isOpen, onClose, documentId }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = `${window.location.origin}/document/${documentId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Share Document</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Share via Link</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                readOnly 
                                value={shareUrl}
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-medium text-gray-500 truncate"
                            />
                            <button 
                                onClick={handleCopy}
                                className="bg-black text-white px-5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50">
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Anyone with this link can view and edit this document in real-time. Make sure you trust the people you share it with.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
