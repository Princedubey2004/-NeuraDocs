const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    content: {
        type: Object,
        required: true,
    },
    title: {
        type: String,
        default: 'Manual Snapshot'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Version', versionSchema);
