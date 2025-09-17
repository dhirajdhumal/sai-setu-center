const express = require("express");
const router = express.Router();
const {
  createApplication,
  getUserApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // store in uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // sanitize filename: replace spaces and remove special characters
    const safeName = file.originalname
      .replace(/\s/g, "_")       // replace spaces with _
      .replace(/[^\w.-]/g, ""); // remove non-alphanumeric except . and -
    cb(null, uniqueSuffix + "-" + safeName);
  },
});

const upload = multer({ storage });

// Routes
router
  .route("/")
  .post(protect, upload.any(), createApplication)  // create new application
  .get(protect, adminOnly, getAllApplications);   // get all applications for admin

router.route("/my").get(protect, getUserApplications); // get user applications

// Update application status
router.route("/:id/status").put(protect, adminOnly, updateApplicationStatus);

module.exports = router;
