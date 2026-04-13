const Document = require('../models/Document');
const User = require('../models/User');
const Version = require('../models/Version');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Create new document
 */
exports.createDocument = async (req, res, next) => {
    try {
        const document = await Document.create({
            owner: req.user.id,
            title: req.body.title || 'Untitled Document'
        });

        res.status(201).json({ success: true, data: document });
    } catch (err) { next(err); }
};

/**
 * @desc    Get single document
 */
exports.getDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('collaborators.user', 'name email');

        if (!document) return next(new ErrorResponse('Document not found', 404));

        const isOwner = document.owner._id.toString() === req.user.id;
        const isCollaborator = document.collaborators.some(col => col.user._id.toString() === req.user.id);

        if (!isOwner && !isCollaborator) return next(new ErrorResponse('Not authorized', 403));

        res.status(200).json({ success: true, data: document });
    } catch (err) { next(err); }
};

/**
 * @desc    Update document title
 */
exports.updateTitle = async (req, res, next) => {
    try {
        let document = await Document.findById(req.params.id);
        if (!document) return next(new ErrorResponse('Document not found', 404));

        const isOwner = document.owner.toString() === req.user.id;
        const isEditor = document.collaborators.some(col => col.user.toString() === req.user.id && col.role === 'editor');

        if (!isOwner && !isEditor) return next(new ErrorResponse('Not authorized', 403));

        document.title = req.body.title;
        await document.save();

        res.status(200).json({ success: true, data: document });
    } catch (err) { next(err); }
};

/**
 * @desc    Add collaborator
 */
exports.addCollaborator = async (req, res, next) => {
    try {
        const { email, role } = req.body;
        const document = await Document.findById(req.params.id);
        if (!document) return next(new ErrorResponse('Document not found', 404));
        if (document.owner.toString() !== req.user.id) return next(new ErrorResponse('Only owner can add collaborators', 403));

        const userToAdd = await User.findOne({ email });
        if (!userToAdd) return next(new ErrorResponse('User not found', 404));

        document.collaborators.push({ user: userToAdd._id, role: role || 'editor' });
        await document.save();

        res.status(200).json({ success: true, data: document });
    } catch (err) { next(err); }
};

/**
 * @desc    Get all documents
 */
exports.getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find({
            $or: [{ owner: req.user.id }, { 'collaborators.user': req.user.id }]
        }).sort('-updatedAt');
        res.status(200).json({ success: true, count: documents.length, data: documents });
    } catch (err) { next(err); }
};

// --- Version History Controllers ---

/**
 * @desc    Save a manual version snapshot
 * @route   POST /api/v1/documents/:id/versions
 * @access  Private
 */
exports.createVersion = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return next(new ErrorResponse('Document not found', 404));

        const version = await Version.create({
            document: document._id,
            content: document.content,
            title: req.body.title || `Snapshot ${new Date().toLocaleString()}`,
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, data: version });
    } catch (err) { next(err); }
};

/**
 * @desc    Get all versions for a document
 * @route   GET /api/v1/documents/:id/versions
 * @access  Private
 */
exports.getVersions = async (req, res, next) => {
    try {
        const versions = await Version.find({ document: req.params.id })
            .populate('createdBy', 'name')
            .sort('-createdAt');

        res.status(200).json({ success: true, data: versions });
    } catch (err) { next(err); }
};

/**
 * @desc    Restore a specific version
 * @route   POST /api/v1/documents/:id/versions/:versionId/restore
 * @access  Private
 */
exports.restoreVersion = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        const version = await Version.findById(req.params.versionId);

        if (!document || !version) return next(new ErrorResponse('Resource not found', 404));

        // Update document content to version content
        document.content = version.content;
        await document.save();

        res.status(200).json({ success: true, data: document });
    } catch (err) { next(err); }
};
