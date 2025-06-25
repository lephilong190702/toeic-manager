// src/services/api.js
import axios from "axios";

// ⚙️ Cấu hình baseURL
const API_BASE_URL = "https://toeic-manager-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// === WORDS ===
export const getAllWords = () => api.get("/words");
export const getWordById = (id) => api.get(`/words/${id}`);
export const createWord = (word) => api.post("/words", word);
export const generateBatch = (words) => api.post("/words/generate-batch", words);
export const updateWord = (id, updatedWord) => api.put(`/words/${id}`, updatedWord);
export const deleteWord = (id) => api.delete(`/words/${id}`);
export const toggleLearned = (id) => api.patch(`/words/learned/${id}`);
export const regeneratePostcard = (id) => api.put(`/words/${id}/regenerate`);
export const getUnlearned = () => api.get("/words/unlearned");

// === TOPICS ===
export const getTopics = () => api.get("/topics");
export const getLearnedWordsByTopic = (topicId) =>
  api.get(`/topics/${topicId}/words/learned`);

// == STATS ==
export const getStats = () => api.get("/stats");
export const getStatsHistory = (range) =>
  api.get(`/stats/history?range=${range}`);


export default {
  getAllWords,
  getWordById,
  createWord,
  generateBatch,
  updateWord,
  deleteWord,
  toggleLearned,
  regeneratePostcard,
  getTopics,
  getLearnedWordsByTopic,
  getStats,
  getStatsHistory,
  getUnlearned
};
