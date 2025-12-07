import React, { useState } from "react";
import api from "../api/axios";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if(!title) return;
    const res = await api.post("/tasks", { title });
    onCreate(res.data);
    setTitle("");
  };
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input className="flex-1 p-2 border" value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task title"/>
      <button className="px-4 py-2 bg-green-600 text-white">Add</button>
    </form>
  );
}
