// src/services/api.js
import axios from "axios";

// ⚙️ Base URL config
const API_BASE_URL = "https://toeic-manager-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === AUTH ===
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);

// === WORDS ===
export const getAllWords = () => api.get("/words");
export const getWordById = (id) => api.get(`/words/${id}`);
export const generateBatch = (words) => api.post("/words/generate-batch", words);
export const regeneratePostcard = (id) => api.put(`/words/${id}/regenerate`);
export const toggleLearned = (id) => api.patch(`/words/learned/${id}`);
export const getUnlearned = () => api.get("/words/unlearned");
export const getLearnedByTopic = (topic) => api.get(`/words/learned-by-topic`, { params: { topic } });
export const deleteWord = (id) => api.delete(`/words/${id}`);

// === STATS / TOPICS ===
export const getTopics = () => api.get("/topics"); // nếu bạn có endpoint này
export const getStats = () => api.get("/stats");   // nếu có endpoint thống kê
export const getStatsHistory = (range) => api.get(`/stats/history?range=${range}`); // nếu có biểu đồ theo tháng


export default {
  login,
  register,
  getAllWords,
  getWordById,
  generateBatch,
  regeneratePostcard,
  toggleLearned,
  getUnlearned,
  getLearnedByTopic,
  deleteWord,
  getTopics,
  getStats,
  getStatsHistory,
};
