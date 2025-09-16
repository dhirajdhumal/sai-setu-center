import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import api from '../services/api';

const Apply = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        fatherName: '',
        dateOfBirth: '',
    });
    // File state
    const [files, setFiles] = useState(null);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // We use FormData for multipart requests (i.e., when uploading files)
        const submissionData = new FormData();
        submissionData.append('serviceId', serviceId);
        submissionData.append('formData', JSON.stringify(formData));

        if (files) {
            for (let i = 0; i < files.length; i++) {
                submissionData.append('documents', files[i]);
            }
        }
        
        try {
             // We need to set the content-type header to multipart/form-data
            await api.post('/applications', submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Application submitted successfully!');
            navigate('/my-applications');
        } catch (error) {
            console.error('Application submission failed:', error);
            alert('Failed to submit application.');
        }
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Apply for: {serviceId.replace(/_/g, ' ')}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    {/* Dynamic fields can be rendered here based on serviceId */}
                    <Typography variant="h6" sx={{ mt: 2 }}>Personal Details</Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Full Name (as per Aadhaar)"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Father's Name"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleFormChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    
                    <Typography variant="h6" sx={{ mt: 3 }}>Upload Documents</Typography>
                    <Button variant="contained" component="label" sx={{ mt: 1 }}>
                        Upload Files
                        <input type="file" hidden multiple onChange={handleFileChange} />
                    </Button>
                    {files && <Typography sx={{mt:1, ml:1}} variant="body2">{files.length} file(s) selected</Typography>}

                    <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 4 }}>
                        Submit Application
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Apply;