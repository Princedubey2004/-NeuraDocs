import { useEffect, useCallback, useState } from 'react';
import socket from '../services/socket';
import { useAuthStore } from '../store/useAuthStore';

export const useSocket = (documentId, quillRef) => {
    const { user } = useAuthStore();
    const [activeUsers, setActiveUsers] = useState([]);
    const [cursors, setCursors] = useState({});
    const [typingUsers, setTypingUsers] = useState({});
    const [messages, setMessages] = useState([]);

    const sendChanges = useCallback((delta) => {
        socket.emit('send-changes', delta);
    }, []);

    const sendCursorUpdate = useCallback((range) => {
        socket.emit('cursor-move', range);
    }, []);

    const saveContent = useCallback((content) => {
        socket.emit('save-document', { documentId, content });
    }, [documentId]);

    const sendTypingStatus = useCallback((isTyping) => {
        socket.emit('typing', isTyping);
    }, []);

    const sendMessage = useCallback((text) => {
        socket.emit('send-message', text);
    }, []);

    useEffect(() => {
        if (!documentId || !user) return;

        socket.connect();
        socket.emit('join-document', { documentId, user });

        socket.on('user-list-update', (users) => setActiveUsers(users));

        socket.on('user-cursor', ({ userId, name, color, range }) => {
            setCursors(prev => ({
                ...prev,
                [userId]: { name, color, range }
            }));
        });

        socket.on('user-typing', ({ userId, name, isTyping }) => {
            setTypingUsers(prev => {
                const newState = { ...prev };
                if (isTyping) newState[userId] = name;
                else delete newState[userId];
                return newState;
            });
        });

        socket.on('receive-message', (message) => {
            setMessages(prev => [...prev.slice(-50), message]); // Keep last 50
        });

        socket.on('receive-changes', (delta) => {
            const quill = quillRef.current?.getEditor();
            if (quill) quill.updateContents(delta, 'api');
        });

        return () => {
            socket.off('user-list-update');
            socket.off('user-typing');
            socket.off('receive-message');
            socket.off('receive-changes');
            socket.disconnect();
        };
    }, [documentId, user, quillRef]);

    return {
        activeUsers,
        cursors,
        typingUsers,
        messages,
        sendChanges,
        sendCursorUpdate,
        saveContent,
        sendTypingStatus,
        sendMessage
    };
};
