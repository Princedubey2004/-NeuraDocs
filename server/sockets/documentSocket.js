const Document = require('../models/Document');

const sessions = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        
        socket.on('join-document', ({ documentId, user }) => {
            socket.join(documentId);
            if (!sessions[documentId]) sessions[documentId] = [];

            const participant = {
                socketId: socket.id,
                userId: user.id,
                name: user.name,
                color: `#${Math.floor(Math.random()*16777215).toString(16)}`
            };

            sessions[documentId].push(participant);
            io.in(documentId).emit('user-list-update', sessions[documentId]);
            
            socket.activeRoom = documentId;
            socket.participant = participant;
            console.log(`[Socket] ${user.name} entered room: ${documentId}`);
        });

        socket.on('send-changes', (delta) => {
            const roomId = socket.activeRoom;
            if (roomId) socket.to(roomId).emit('receive-changes', delta);
        });

        socket.on('typing', (isTyping) => {
            const roomId = socket.activeRoom;
            if (roomId && socket.participant) {
                socket.to(roomId).emit('user-typing', {
                    userId: socket.participant.userId,
                    name: socket.participant.name,
                    isTyping
                });
            }
        });

        socket.on('cursor-move', (range) => {
            const roomId = socket.activeRoom;
            if (roomId && socket.participant) {
                socket.to(roomId).emit('user-cursor', {
                    userId: socket.participant.userId,
                    name: socket.participant.name,
                    color: socket.participant.color,
                    range
                });
            }
        });

        // --- Chat System ---
        socket.on('send-message', (message) => {
            const roomId = socket.activeRoom;
            if (roomId && socket.participant) {
                const messageData = {
                    id: Date.now(),
                    text: message,
                    user: socket.participant.name,
                    userId: socket.participant.userId,
                    color: socket.participant.color,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                // Broadcast to everyone in room including sender if we want sync on all clients
                io.in(roomId).emit('receive-message', messageData);
            }
        });

        socket.on('save-document', async ({ documentId, content }) => {
            try {
                await Document.findByIdAndUpdate(documentId, { content });
            } catch (err) {
                console.error(`[DB Error] Failed to auto-save:`, err.message);
            }
        });

        socket.on('disconnect', () => {
            const roomId = socket.activeRoom;
            if (roomId && sessions[roomId]) {
                sessions[roomId] = sessions[roomId].filter(p => p.socketId !== socket.id);
                io.in(roomId).emit('user-list-update', sessions[roomId]);
                if (sessions[roomId].length === 0) delete sessions[roomId];
            }
        });
    });
};
