const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    status: {
        type: String,
        enum: ['Submitted', 'In Progress', 'Completed', 'Rejected'],
        default: 'Submitted'
    },
    formData: { type: mongoose.Schema.Types.Mixed, required: true }, // For flexible form data
    documents: [{
        fieldName: String, // e.g., 'aadhaarCard'
        filePath: String   // e.g., '/uploads/aadhaar-12345.pdf'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);