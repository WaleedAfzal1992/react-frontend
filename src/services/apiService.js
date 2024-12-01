import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/'; // Ensure URL ends with a slash

// Create an Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
});

// Add an interceptor to include the token in all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Access token stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Blog creation function
export const createBlog = async (title, content) => {
  try {
    const response = await API.post('/blogs/', { title, content });
    console.log('Blog created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Register function
export const register = async (data) => {
  try {
    const response = await API.post('/register/', data);
    console.log('User registered successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Login function
export const login = async (data) => {
  try {
    const response = await API.post('/login/', data);
    const { access, refresh } = response.data; // Extract tokens from response
    // Store tokens in localStorage
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    console.log('Login successful, tokens stored!');
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Handle form submission for blog creation
export const handleSubmit = async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value; // Get title from form input
  const content = document.getElementById('content').value; // Get content from form input

  try {
    await createBlog(title, content);
    alert('Blog created successfully!');
  } catch (error) {
    alert('Error creating blog. Please try again.');
  }
};

// Refresh access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token found');

    const response = await API.post('/token/refresh/', { refresh: refreshToken });
    const { access } = response.data;
    localStorage.setItem('accessToken', access);
    console.log('Access token refreshed!');
    return access;
  } catch (error) {
    console.error('Error refreshing token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('User logged out!');
};

// Export the Axios instance for reuse
export default API;
