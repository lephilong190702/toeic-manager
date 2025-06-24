// src/services/api.js
import axios from "axios";

// ⚙️ Cấu hình baseURL
const API_BASE_URL = "http://localhost:8080/api/words";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Lấy toàn bộ từ
export const getAllWords = () => api.get("/");

// 2. Lấy từ theo ID
export const getWordById = (id) => api.get(`/${id}`);

// 3. Thêm từ mới (chỉ cần vocabulary, backend sẽ tự generate postcard)
export const createWord = (word) => api.post("", word);

export const generateBatch = (words) => api.post("/generate-batch", words)
// 4. Cập nhật từ
export const updateWord = (id, updatedWord) => api.put(`/${id}`, updatedWord);

// 5. Xoá từ
export const deleteWord = (id) => api.delete(`/${id}`);

// 6. Đánh dấu học hoặc bỏ đánh dấu
export const toggleLearned = (id) => api.patch(`/learned/${id}`);

// 7. Gọi AI để generate lại postcard
export const regeneratePostcard = (id) => api.post(`/${id}/generate`);

export default {
  getAllWords,
  getWordById,
  createWord,
  generateBatch,
  updateWord,
  deleteWord,
  toggleLearned,
  regeneratePostcard,
};
