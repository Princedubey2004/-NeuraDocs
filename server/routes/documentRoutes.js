const express = require('express');
const {
    createDocument,
    getDocument,
    getDocuments,
    updateTitle,
    addCollaborator,
    createVersion,
    getVersions,
    restoreVersion
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getDocuments)
    .post(createDocument);

router.route('/:id')
    .get(getDocument);

router.put('/:id/title', updateTitle);
router.post('/:id/collaborators', addCollaborator);

// Version History
router.route('/:id/versions')
    .get(getVersions)
    .post(createVersion);

router.post('/:id/versions/:versionId/restore', restoreVersion);

module.exports = router;
