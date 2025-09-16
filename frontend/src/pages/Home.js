import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Welcome to Sai Setu Portal
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
                Your one-stop solution for all government services.
            </Typography>
            <Button variant="contained" size="large" component={Link} to="/dashboard" sx={{ mt: 4 }}>
                Explore Services
            </Button>
        </Box>
    );
};

export default Home;