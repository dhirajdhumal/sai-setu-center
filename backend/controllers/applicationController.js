const mongoose = require("mongoose");
const Application = require("../models/Application");
const Service = require("../models/Service");

// Create new application
exports.createApplication = async (req, res) => {
  try {
    const { service, mobileNumber } = req.body;

    if (!service || !mobileNumber) {
      return res.status(400).json({ message: "Service and form data are required" });
    }

    // Validate service ID
    if (!mongoose.Types.ObjectId.isValid(service)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const documents = (req.files || []).map(file => ({
  fieldName: file.fieldname,
  filePath: file.path,
}));


    const newApplication = new Application({
      user: req.user._id,
      service,
      mobileNumber,
      documents,
    });

    const savedApp = await newApplication.save();
    res.status(201).json(savedApp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating application", error: err.message });
  }
};

// Get logged-in user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id })
      .populate("service", "title description fees");
    res.status(200).json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching applications", error: err.message });
  }
};

// Admin: Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("user", "name email")
      .populate("service", "title fees description");
    res.status(200).json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching applications", error: err.message });
  }
};

// Admin: Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Submitted", "In Progress", "Completed", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Validate application ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const app = await Application.findById(id);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.status = status;
    const updatedApp = await app.save();

    res.status(200).json(updatedApp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};
