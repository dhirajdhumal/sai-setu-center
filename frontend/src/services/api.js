import axios from 'axios';

const api = axios.create({
    baseURL: "https://sai-setu-center.onrender.com/api", // Your backend APIURL "https://sai-setu-center.onrender.com/api", "http://localhost:5001/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;