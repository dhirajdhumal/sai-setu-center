import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Import the Alert component for displaying messages
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import AuthContext from '../context/authContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    // Add a state to hold any error messages from the server
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors before a new submission

        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            // Get the specific message from the server's response
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            // Set the error message so it can be displayed to the user
            setError(message);
            console.error('Registration failed:', err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    {/* This line conditionally displays the Alert box only when an error exists */}
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;