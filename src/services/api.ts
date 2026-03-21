import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
    const stored = localStorage.getItem("auth");
    const token = stored ? JSON.parse(stored).token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
