import axios from 'axios';
import {store} from "../store";
import {logout} from "../store/slices/authSlice";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Log all requests for debugging
axiosClient.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url, {
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        if (error.response?.status === 401) {
            store.dispatch(logout());
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getCsrfToken = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });
        console.log('CSRF token response:', response);
        return response;
    } catch (error) {
        console.error('Error getting CSRF token:', error);
        throw error;
    }
};

export default axiosClient;