import axios from 'axios';

const api = axios.create({
  baseURL: 'https://skillbarter-19iw.onrender.com/api'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("skillbarter_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const sendBarterRequest = (payload) => api.post('/requests', payload);

export const fetchIncomingRequests = () => api.get('/requests/incoming');

export const fetchAcceptedBarters = () => api.get('/requests/accepted');

export const updateRequestStatus = (id, status) =>
  api.put(`/requests/${id}`, { status });

export const getChatHistory = (receiverId) =>
  api.get(`/chat/${receiverId}`);

export default api;

