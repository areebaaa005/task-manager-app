import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuExternalLink, LuPencil } from "react-icons/lu";
import moment from "moment";
import DashboardLayout from "../components/DashboardLayout.jsx";
import axiosInstance from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const statusBadge = {
  Pending: "bg-violet-100 text-violet-700",
  "In Progress": "bg-cyan-100 text-cyan-700",
  Completed: "bg-green-100 text-green-700",
};

const TaskDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  const fetchTask = async () => {
    try {
      const res = await axiosInstance.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleChecklistItem = async (idx) => {
    const updatedChecklist = task.todoChecklist.map((item, i) =>
      i === idx ? { ...item, completed: !item.completed } : item
    );
    setTask({ ...task, todoChecklist: updatedChecklist });
    try {
      const res = await axiosInstance.put(`/tasks/${id}/checklist`, {
        todoChecklist: updatedChecklist,
      });
      setTask(res.data.task);
    } catch (err) {
      console.error(err);
      fetchTask();
    }
  };

  if (!task) {
    return (
      <DashboardLayout>
        <p className="text-sm text-gray-400">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-3xl">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
          <div className="flex items-center gap-3">
            <span className={`badge ${statusBadge[task.status]}`}>{task.status}</span>
            {user?.role === "admin" && (
              <button
                onClick={() => navigate(`/tasks/${id}/edit`)}
                className="text-gray-400 hover:text-primary"
                title="Edit task"
              >
                <LuPencil size={16} />
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">Description</p>
          <p className="text-sm text-gray-700">{task.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Priority</p>
            <p className="text-sm text-gray-800">{task.priority}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Due Date</p>
            <p className="text-sm text-gray-800">{moment(task.dueDate).format("Do MMM YYYY")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Assigned To</p>
            <div className="flex -space-x-2 mt-1">
              {task.assignedTo?.map((u) => (
                <img
                  key={u._id}
                  src={u.profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`}
                  title={u.name}
                  alt={u.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-400 mb-2">Todo Checklist</p>
          <div className="space-y-2">
            {task.todoChecklist.map((item, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(idx)}
                  className="w-4 h-4 accent-primary"
                />
                <span
                  className={`text-sm ${item.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                >
                  {item.text}
                </span>
              </label>
            ))}
            {task.todoChecklist.length === 0 && (
              <p className="text-sm text-gray-400">No checklist items.</p>
            )}
          </div>
        </div>

        {task.attachments?.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-400 mb-2">Attachments</p>
            <div className="space-y-2">
              {task.attachments.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="truncate">
                    {String(idx + 1).padStart(2, "0")} {link}
                  </span>
                  <LuExternalLink size={14} className="text-gray-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TaskDetails;
