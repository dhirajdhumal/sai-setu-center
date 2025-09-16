import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import api from '../services/api';
import ServiceCard from '../components/ServiceCard';

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
        <div>
            <Typography variant="h4" gutterBottom>
                Available Services
            </Typography>
            <Grid container spacing={3}>
                {services.map(service => (
                    <Grid item key={service._id} xs={12} sm={6} md={4}>
                        <ServiceCard service={service} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Dashboard;