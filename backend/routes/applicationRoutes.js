const express = require("express");
const router = express.Router();
const {
  createApplication,
  getUserApplications,
  getAllApplications,
  updateApplication,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Multer storage config (Cloudinary)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "applications",     // Cloudinary folder
    resource_type: "auto",      // auto = pdf, image, video
    format: async (req, file) => undefined, // keep original format
    public_id: (req, file) => {
      const safeName = file.originalname
        .replace(/\s/g, "_")
        .replace(/[^\w.-]/g, ""); 
      return Date.now() + "-" + safeName;
    },
  },
});

const upload = multer({ storage });

// Routes
router
  .route("/")
  .post(protect, upload.any(), createApplication)  // Files now go to Cloudinary
  .get(protect, adminOnly, getAllApplications);

router.route("/my").get(protect, getUserApplications);
router.route("/:id").put(protect, updateApplication);
router.route("/:id/status").put(protect, adminOnly, updateApplicationStatus);

module.exports = router;
