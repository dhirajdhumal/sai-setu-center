import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Step 1: Import the Alert component
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import AuthContext from '../context/authContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Step 2: Add a state to hold the error message
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            // Step 3: Get the message from the server and set it in the state
            const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(message);
            console.error('Login failed:', err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    {/* Step 4: Display the Alert if an error exists */}
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
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
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;