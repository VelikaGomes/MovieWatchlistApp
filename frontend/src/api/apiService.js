// frontend/src/api/apiService.js

import axios from 'axios';

// Get the base URL from the environment variable
const API_URL = process.env.REACT_APP_API_BASE_URL;

// Create an instance of Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach the JWT token to every request
api.interceptors.request.use(config => {
    // Check if the token exists in local storage
    const token = localStorage.getItem('token');
    
    if (token) {
        // Attach the token as a Bearer token in the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;