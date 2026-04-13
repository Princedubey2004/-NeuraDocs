import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { 
    Sparkles, 
    MessageSquare, 
    Send, 
    X, 
    Loader2, 
    AlignLeft, 
    RefreshCw, 
    CheckCircle2 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, selectedText, onApplyChange, messages, onSendMessage }) => {
    const [activeTab, setActiveTab] = useState('ai');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState('');
    const [aiError, setAiError] = useState('');
    const [chatInput, setChatInput] = useState('');
    
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (activeTab === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activeTab]);

    const handleAIAction = async (action) => {
        if (!selectedText) {
            setAiError('Highlight text in the editor first.');
            return;
        }
        setAiLoading(true);
        setAiError('');
        setAiResult('');
        try {
            const { data } = await api.post(`/ai/${action}`, { text: selectedText });
            setAiResult(data.data);
        } catch (err) {
            setAiError(err.response?.data?.error || 'AI request failed');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSendChat = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        onSendMessage(chatInput);
        setChatInput('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-85 bg-white shadow-2xl border-l z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Tab Header */}
            <div className="flex border-b">
                <button 
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
                        activeTab === 'ai' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <Sparkles className="h-4 w-4" />
                    AI Assistant
                </button>
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
                        activeTab === 'chat' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                    {messages.length > 0 && activeTab !== 'chat' && (
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                </button>
                <button onClick={onClose} className="px-4 text-gray-300 hover:text-gray-600">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* AI Tab Content */}
            {activeTab === 'ai' && (
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-[11px] text-gray-500 leading-relaxed shadow-inner">
                        {selectedText ? (
                            <span className="text-gray-700 not-italic font-medium">"{selectedText.substring(0, 150)}{selectedText.length > 150 ? '...' : ''}"</span>
                        ) : (
                            <div className="space-y-2">
                                <p>✨ Highlight text in the editor to unlock AI powers.</p>
                                <p className="text-indigo-600 font-bold opacity-70">PRO TIP: Try selecting a paragraph to summarize it instantly.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={() => handleAIAction('summarize')}
                            disabled={aiLoading || !selectedText}
                            className="flex items-center gap-3 w-full p-4 rounded-2xl border border-gray-100 hover:bg-indigo-50 text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn shadow-sm hover:shadow-md"
                            title={!selectedText ? "Select text in the editor to summarize" : "Summarize selection"}
                        >
                            <AlignLeft className="h-4 w-4 text-indigo-500 group-hover/btn:scale-110 transition-transform" /> Summarize
                        </button>
                        <button 
                            onClick={() => handleAIAction('rewrite')}
                            disabled={aiLoading || !selectedText}
                            className="flex items-center gap-3 w-full p-4 rounded-2xl border border-gray-100 hover:bg-indigo-50 text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn shadow-sm hover:shadow-md"
                            title={!selectedText ? "Select text in the editor to rewrite" : "Rewrite selection"}
                        >
                            <RefreshCw className="h-4 w-4 text-emerald-500 group-hover/btn:scale-110 transition-transform" /> Rewrite
                        </button>
                        <button 
                            onClick={() => handleAIAction('fix-grammar')}
                            disabled={aiLoading || !selectedText}
                            className="flex items-center gap-3 w-full p-4 rounded-2xl border border-gray-100 hover:bg-indigo-50 text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn shadow-sm hover:shadow-md"
                            title={!selectedText ? "Select text in the editor to fix grammar" : "Fix grammar in selection"}
                        >
                            <CheckCircle2 className="h-4 w-4 text-amber-500 group-hover/btn:scale-110 transition-transform" /> Fix Grammar
                        </button>
                    </div>

                    {aiLoading && (
                        <div className="flex flex-col items-center py-6 gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Processing</span>
                        </div>
                    )}

                    {aiError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">{aiError}</div>}
                    
                    {aiResult && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="p-4 bg-indigo-50 text-gray-800 text-sm leading-relaxed rounded-xl border border-indigo-100 font-medium">
                                {aiResult}
                            </div>
                            <button 
                                onClick={() => onApplyChange(aiResult)}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                            >
                                Replace Selection
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Chat Tab Content */}
            {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col h-full bg-gray-50/50">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                <MessageSquare className="h-8 w-8 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold" style={{ color: msg.color }}>{msg.user}</span>
                                    <span className="text-[9px] text-gray-400 font-medium">{msg.time}</span>
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-700 font-medium">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendChat} className="p-4 bg-white border-t">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Message teammates..."
                                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-100"
                            />
                            <button 
                                type="submit"
                                className="absolute right-2 top-1.5 h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
