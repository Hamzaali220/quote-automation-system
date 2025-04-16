const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const verifyAdmin = require('../middlewares/verifyAdmin');

const upload = multer({
  dest: path.join(__dirname, '..', '..', 'admin_uploads')
});

// Public
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);

// Protected
router.post('/upload', verifyAdmin, upload.array('files'), adminController.uploadPDFs);
router.get('/files', verifyAdmin, adminController.listPDFs);
router.delete('/files/:filename', verifyAdmin, adminController.deletePDF);
router.post('/train', verifyAdmin, adminController.trainModel);
module.exports = router;
