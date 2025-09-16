const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin-only CRUD
router.post("/", protect, adminOnly, serviceController.createService);
router.put("/:id", protect, adminOnly, serviceController.updateService);
router.delete("/:id", protect, adminOnly, serviceController.deleteService);

// Public routes
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

module.exports = router;
