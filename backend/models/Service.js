const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    serviceId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredDocuments: [{ type: String, required: true }] // e.g., ['Aadhaar Card', 'Photo']
});

module.exports = mongoose.model('Service', ServiceSchema);