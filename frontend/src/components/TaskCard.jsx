import React from "react";

export default function TaskCard({ task }) {
  return (
    <div className="p-3 border rounded flex justify-between items-center">
      <div>
        <div className="font-semibold">{task.title}</div>
        <div className="text-sm text-gray-600">{task.description}</div>
      </div>
      <div className="text-sm">{task.status}</div>
    </div>
  );
}
