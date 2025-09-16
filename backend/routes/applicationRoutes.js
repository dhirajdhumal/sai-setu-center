const express = require('express');
const router = express.Router();
const { createApplication, getUserApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        // Create a unique filename to avoid overwriting
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// We use upload.array() to accept multiple files.
// The field names in the form data must match the strings passed here.
router.route('/')
    .post(protect, upload.array('documents'), createApplication)
    .get(protect, getUserApplications);

module.exports = router;