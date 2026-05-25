import axios from 'axios';

const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return `${apiUrl}/api`;
  }
  return '/api'; // Development: use relative URL with vite proxy
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('zen_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Goals
export const fetchGoals = () => API.get('/goals');
export const createGoal = (data) => API.post('/goals', data);
export const updateGoal = (id, data) => API.put(`/goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

// Habits
export const fetchHabits = () => API.get('/habits');
export const createHabit = (data) => API.post('/habits', data);
export const toggleHabit = (id, data) => API.put(`/habits/${id}/toggle`, data);
export const updateHabit = (id, data) => API.put(`/habits/${id}`, data);
export const deleteHabit = (id) => API.delete(`/habits/${id}`);

// Reflections
export const fetchReflections = (limit) => API.get(`/reflections?limit=${limit || 30}`);
export const createReflection = (data) => API.post('/reflections', data);
export const deleteReflection = (id) => API.delete(`/reflections/${id}`);

// Analytics
export const fetchAnalytics = () => API.get('/analytics');

// Pomodoro
export const logPomodoro = (data) => API.post('/pomodoro', data);
export const getTodayPomodoros = () => API.get('/pomodoro/today');

export default API;
