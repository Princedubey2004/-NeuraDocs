import React, { useState } from 'react';
import api from '../services/api';
import { Sparkles, Loader2, RefreshCw, AlignLeft, CheckCircle2, X } from 'lucide-react';

const AISidebar = ({ isOpen, onClose, selectedText, onApplyChange }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleAIAction = async (action) => {
        if (!selectedText) {
            setError('Please select some text in the editor first.');
            return;
        }

        setLoading(true);
        setError('');
        setResult('');

        try {
            const endpoint = `/ai/${action}`;
            const { data } = await api.post(endpoint, { text: selectedText });
            setResult(data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'AI request failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2 font-semibold text-indigo-600">
                    <Sparkles className="h-5 w-5" />
                    <span>AI Assistant</span>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Context Indicator */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 italic text-xs text-gray-500">
                    {selectedText ? (
                        <p className="line-clamp-3">" {selectedText} "</p>
                    ) : (
                        <p className="text-amber-600 font-medium">No text selected. Highlight text in the editor to use AI features.</p>
                    )}
                </div>

                {/* Performance Actions */}
                <div className="grid grid-cols-1 gap-2">
                    <button 
                        onClick={() => handleAIAction('summarize')}
                        disabled={loading || !selectedText}
                        className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <AlignLeft className="h-4 w-4 text-indigo-500" />
                        Summarize
                    </button>
                    <button 
                        onClick={() => handleAIAction('rewrite')}
                        disabled={loading || !selectedText}
                        className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <RefreshCw className="h-4 w-4 text-emerald-500" />
                        Rewrite
                    </button>
                    <button 
                        onClick={() => handleAIAction('fix-grammar')}
                        disabled={loading || !selectedText}
                        className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <CheckCircle2 className="h-4 w-4 text-amber-500" />
                        Fix Grammar
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-10 space-y-3">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        <p className="text-sm text-gray-500 font-medium font-animate-pulse">NeuraDocs is thinking...</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {/* AI Result */}
                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-gray-800 leading-relaxed font-medium">
                            {result}
                        </div>
                        <button 
                            onClick={() => onApplyChange(result)}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all text-sm"
                        >
                            Replace Selection
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                Powered by NeuraDocs AI
            </div>
        </div>
    );
};

export default AISidebar;
