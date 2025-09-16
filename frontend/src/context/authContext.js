import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on initial load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            // Set token for subsequent API requests
            api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;