const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const upload = require('../middlewares/upload');

// POST /api/quotes
router.post(
    '/',
    upload.fields([
        { name: 'specsFile', maxCount: 1 },
        { name: 'communicationFile', maxCount: 1 }
    ]),
    quoteController.createQuote
);
// GET /api/quotes/:id
router.get('/:id', quoteController.getQuoteById);

module.exports = router;

