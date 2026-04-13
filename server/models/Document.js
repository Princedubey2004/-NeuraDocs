const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled Document',
        trim: true,
    },
    content: {
        type: Object, // Stores Quill delta or similar
        default: {},
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    collaborators: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['viewer', 'editor'],
                default: 'editor',
            },
        },
    ],
    lastModified: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Update lastModified on save
documentSchema.pre('save', async function() {
    this.lastModified = Date.now();
});

module.exports = mongoose.model('Document', documentSchema);
