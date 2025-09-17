import axios from 'axios';

const api = axios.create({
    baseURL: "https://sai-setu-center.onrender.com/api", // Your backend API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;