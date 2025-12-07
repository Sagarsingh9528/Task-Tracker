import axios from "axios";

// ✅ YOUR BACKEND BASE URL
const API = "https://task-tracker-sandy-two.vercel.app/api/tasks";

const TaskService = {
  getAll: (token) =>
    axios.get(API, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getOne: (id, token) =>
    axios.get(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  create: (data, token) =>
    axios.post(API, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  update: (id, data, token) =>
    axios.put(`${API}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  remove: (id, token) =>
    axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getAllFiltered: (query, token) =>
    axios.get(`${API}${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default TaskService;
