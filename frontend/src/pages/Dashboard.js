import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, Box, Divider } from '@mui/material';
import api from '../services/api';
import ServiceCard from '../components/ServiceCard';

// NEW: Import the new DocumentCard component and icons
import DocumentCard from '../components/DocumentCard';
import Fingerprint from '@mui/icons-material/Fingerprint';
import CreditCard from '@mui/icons-material/CreditCard';
import Article from '@mui/icons-material/Article';

// NEW: Define the static data for the document cards
const documentServices = [
    {
        _id: 'doc-aadhar',
        name: 'Aadhar Card',
        icon: <Fingerprint color="primary" />,
        docs: ['Proof of Identity (e.g., PAN, Passport)', 'Proof of Address (e.g., Utility Bill)', 'Birth Certificate']
    },
    {
        _id: 'doc-pan',
        name: 'PAN Card',
        icon: <CreditCard color="primary" />,
        docs: ['Proof of Identity (e.g., Aadhar)', 'Proof of Address', 'Proof of Date of Birth', '2 Passport Photos']
    },
    {
        _id: 'doc-caste',
        name: 'Caste Certificate',
        icon: <Article color="primary" />,
        docs: ['Identity & Address Proof', 'Proof of Caste (Relative\'s cert.)', 'Affidavit', 'State-specific forms']
    }
];


const Dashboard = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await api.get('/services');
                setServices(data);
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        // NEW: Changed div to Box for better styling control
        <Box sx={{ p: 2 }}>
            {/* NEW: Section for Document Cards */}
            <Typography variant="h5" gutterBottom>
                Get Started with Documents
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {documentServices.map(service => (
                    <Grid item key={service._id} xs={12} sm={6} md={4}>
                        <DocumentCard service={service} />
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 4 }} /> 

            {/* Existing section for dynamic services */}
            <Typography variant="h4" gutterBottom>
                Available Services For You
            </Typography>
            <Grid container spacing={3}>
                {services.map(service => (
                    <Grid item key={service._id} xs={12} sm={6} md={4}>
                        <ServiceCard service={service} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Dashboard;