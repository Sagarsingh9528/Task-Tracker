import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskService from "../api/taskService";

export default function TaskPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const [task, setTask] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fetchTask = async () => {
    try {
      const res = await TaskService.getOne(id, token);
      setTask(res.data);
    } catch (err) {
      console.log("Error loading task:", err);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await TaskService.update(id, task, token);
      nav("/dashboard");
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  const handleDelete = async () => {
    await TaskService.remove(id, token);
    nav("/dashboard");
  };

  if (!task) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {editMode ? (
          <>
            <h2 style={styles.heading}>Edit Task</h2>

            <input
              style={styles.input}
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              placeholder="Task Title"
            />

            <textarea
              style={styles.textarea}
              value={task.description || ""}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              placeholder="Task Description"
            />

            <label style={styles.label}>Status</label>
            <select
              style={styles.select}
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <label style={styles.label}>Priority</label>
            <select
              style={styles.select}
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>

            <button style={styles.updateBtn} onClick={handleUpdate}>
              Update Task
            </button>

            <button style={styles.cancelBtn} onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <h1 style={styles.heading}>{task.title}</h1>

            <p style={styles.description}>{task.description}</p>

            <p style={styles.info}>
              <b>Status:</b> <span style={styles.statusBadge(task.status)}>{task.status}</span>
            </p>

            <p style={styles.info}>
              <b>Priority:</b> <span style={styles.priorityBadge(task.priority)}>{task.priority}</span>
            </p>

            <div style={styles.buttonRow}>
              <button
                style={styles.editBtn}
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    background: "white",
    width: "100%",
    maxWidth: "600px",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },

  heading: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    marginBottom: "12px",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    minHeight: "100px",
    marginBottom: "12px",
  },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    marginBottom: "12px",
  },

  label: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "5px",
    marginTop: "10px",
  },

  description: {
    fontSize: "16px",
    marginBottom: "15px",
    lineHeight: "1.6",
  },

  info: {
    marginBottom: "10px",
    fontSize: "16px",
  },

  statusBadge: (status) => ({
    padding: "6px 12px",
    borderRadius: "6px",
    background:
      status === "completed"
        ? "#4ade80"
        : status === "in-progress"
        ? "#fbbf24"
        : "#e2e8f0",
    textTransform: "capitalize",
  }),

  priorityBadge: (priority) => ({
    padding: "6px 12px",
    borderRadius: "6px",
    background:
      priority === "high"
        ? "#f87171"
        : priority === "normal"
        ? "#facc15"
        : "#cbd5e1",
    textTransform: "capitalize",
  }),

  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  editBtn: {
    flex: 1,
    background: "#3b82f6",
    padding: "12px",
    borderRadius: "8px",
    color: "white",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },

  deleteBtn: {
    flex: 1,
    background: "#ef4444",
    padding: "12px",
    borderRadius: "8px",
    color: "white",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },

  updateBtn: {
    background: "#16a34a",
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },

  cancelBtn: {
    background: "#64748b",
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },

  loading: {
    padding: "20px",
    textAlign: "center",
  },
};
