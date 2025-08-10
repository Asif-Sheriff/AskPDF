import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {

  login: (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    return api.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Override default JSON
      },
    });
  },
  signup: (username: string, password: string) =>
    api.post('/signup', { username, password }),
};

export const projectAPI = {
  getProjects: () => api.get('/projects'),
  createProject: (formData: FormData) =>
    api.post('/createProject', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProject: (projectId: string) => api.delete(`/projects/${projectId}`),
};

export const chatAPI = {
  getChatHistory: (projectId: string) => api.get(`/chat/${projectId}`),
  sendMessage: (projectId: string, message: string) =>
    api.post(`/chat/${projectId}`, { message }),
};

export default api;