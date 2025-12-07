import React, { useEffect, useState } from "react";
import TaskService from "../api/taskService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchTasks = async () => {
    try {
      let query = `?q=${search}`;

      if (statusFilter) query += `&status=${statusFilter}`;
      if (priorityFilter) query += `&priority=${priorityFilter}`;

      const res = await TaskService.getAllFiltered(query, token);
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.log("Error loading tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, priorityFilter]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    await TaskService.create({ title: newTask }, token);
    setNewTask("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await TaskService.remove(id, token);
    fetchTasks();
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Tasks</h1>

     
      <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

     
      <div style={styles.filterRow}>
        <select
          style={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          style={styles.select}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <button style={styles.clearBtn} onClick={clearFilters}>
          Clear
        </button>
      </div>

      
      <div style={styles.addContainer}>
        <input
          placeholder="New task title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addBtn}>Add</button>
      </div>

      
      {tasks.map((task) => (
        <div key={task._id} style={styles.card}>
          
         
          <div
            onClick={() => nav(`/tasks/${task._id}`)}
            style={styles.title}
          >
            {task.title}
          </div>

          
          <div style={styles.badges}>
            <span style={styles.status(task.status)}>{task.status}</span>
            <span style={styles.priority(task.priority)}>{task.priority}</span>
          </div>

         
          <button
            style={styles.edit}
            onClick={() => nav(`/tasks/${task._id}`)}
          >
            Update
          </button>

         
          <button
            style={styles.delete}
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      ))}

      {tasks.length === 0 && <p>No tasks found.</p>}
    </div>
  );
}




const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  search: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginBottom: "20px",
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  select: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  clearBtn: {
    padding: "10px 15px",
    background: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  addContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  addBtn: {
    background: "#16a34a",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto auto",
    alignItems: "center",
    padding: "15px",
    background: "white",
    borderRadius: "10px",
    marginBottom: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "18px",
    cursor: "pointer",
  },
  badges: {
    display: "flex",
    gap: "10px",
  },
  status: (value) => ({
    padding: "6px 10px",
    borderRadius: "6px",
    background:
      value === "completed"
        ? "#4ade80"
        : value === "in-progress"
        ? "#fbbf24"
        : "#e2e8f0",
    textTransform: "capitalize",
  }),
  priority: (value) => ({
    padding: "6px 10px",
    borderRadius: "6px",
    background:
      value === "high"
        ? "#f87171"
        : value === "normal"
        ? "#facc15"
        : "#cbd5e1",
    textTransform: "capitalize",
  }),
  edit: {
    background: "#3b82f6",
    padding: "8px 14px",
    borderRadius: "8px",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginRight: "10px",
  },
  delete: {
    background: "#ef4444",
    padding: "8px 14px",
    borderRadius: "8px",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
