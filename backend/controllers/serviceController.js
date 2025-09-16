const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// NOTE: In a real app, you'd have an admin-only route to add services.
// For this example, we can add them directly to the database.
// e.g., using a seeder script or MongoDB Compass.

module.exports = { getServices };