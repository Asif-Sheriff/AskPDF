import axios from 'axios';
import { Message, Project, QueryResponse } from '../types';

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

  createProject: async (pdfFile: File) : Promise<Project> => {
    const title = pdfFile.name;
    const description = `${title} document chat`;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('pdf_file', pdfFile);

    const response = await api.post<Project>('/createProject', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response);
    

    return response.data
  },

  deleteProject: (projectId: string) => api.delete(`/projects/${projectId}`),
};



export const chatAPI = {
  getChatHistory: (projectId: string) => api.get<Message[]>(`/chats/${projectId}`),
  sendMessage: (projectId: string, message: string) =>
    api.post<QueryResponse>(`/query/${projectId}`, { query: message, top_k : 3 }),
};

export default api;