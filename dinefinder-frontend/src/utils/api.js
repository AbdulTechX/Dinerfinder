import axios from 'axios';

// Define the API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Create an Axios instance with interceptors
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Ensure consistent token naming
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// User registration
export const registerUser = (data) => apiClient.post('/users/register', data);

// User login
export const loginUser = (data) => apiClient.post('/users/login', data);

// Fetch user profile
export const getUserProfile = async () => {
    const token = localStorage.getItem('token'); // Replace with your token storage logic
    return axios.get('/api/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
// Update user profile
export const updateUserProfile = async (formData) => {
    try {
        const response = await apiClient.put('/profile', {
            username: formData.username,
            phone: formData.phone, // Include only mutable fields
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
