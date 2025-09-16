const Application = require('../models/Application');
const Service = require('../models/Service');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
    try {
        const { serviceId, formData } = req.body;
        const service = await Service.findOne({ serviceId: serviceId });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        let uploadedDocuments = [];
        if (req.files) {
             uploadedDocuments = req.files.map(file => ({
                fieldName: file.fieldname,
                filePath: file.path
            }));
        }

        const application = new Application({
            user: req.user._id,
            service: service._id,
            formData: JSON.parse(formData),
            documents: uploadedDocuments
        });

        const createdApplication = await application.save();
        res.status(201).json(createdApplication);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user's applications
// @route   GET /api/applications
// @access  Private
const getUserApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id }).populate('service', 'title fees');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createApplication, getUserApplications };