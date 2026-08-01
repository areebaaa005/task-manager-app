import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuTrash2, LuPlus, LuUsers } from "react-icons/lu";
import DashboardLayout from "../components/DashboardLayout.jsx";
import SelectUsersModal from "../components/SelectUsersModal.jsx";
import axiosInstance from "../api/axios.js";

const emptyTask = {
  title: "",
  description: "",
  priority: "Low",
  dueDate: "",
  assignedTo: [],
  todoChecklist: [],
  attachments: [],
};

const CreateTask = () => {
  const { id } = useParams(); // present when editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [task, setTask] = useState(emptyTask);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [checklistInput, setChecklistInput] = useState("");
  const [attachmentInput, setAttachmentInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchTask = async () => {
        try {
          const res = await axiosInstance.get(`/tasks/${id}`);
          const t = res.data;
          setTask({
            title: t.title,
            description: t.description,
            priority: t.priority,
            dueDate: t.dueDate ? t.dueDate.split("T")[0] : "",
            assignedTo: t.assignedTo.map((u) => u._id),
            todoChecklist: t.todoChecklist,
            attachments: t.attachments,
          });
          setAssignedUsers(t.assignedTo);
        } catch (err) {
          console.error(err);
        }
      };
      fetchTask();
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => setTask((prev) => ({ ...prev, [field]: value }));

  const addChecklistItem = () => {
    if (!checklistInput.trim()) return;
    handleChange("todoChecklist", [...task.todoChecklist, { text: checklistInput.trim(), completed: false }]);
    setChecklistInput("");
  };

  const removeChecklistItem = (idx) => {
    handleChange(
      "todoChecklist",
      task.todoChecklist.filter((_, i) => i !== idx)
    );
  };

  const addAttachment = () => {
    if (!attachmentInput.trim()) return;
    handleChange("attachments", [...task.attachments, attachmentInput.trim()]);
    setAttachmentInput("");
  };

  const removeAttachment = (idx) => {
    handleChange(
      "attachments",
      task.attachments.filter((_, i) => i !== idx)
    );
  };

  const handleSubmit = async () => {
    setError("");
    if (!task.title || !task.dueDate) {
      setError("Task title and due date are required.");
      return;
    }
    try {
      setLoading(true);
      if (isEdit) {
        await axiosInstance.put(`/tasks/${id}`, task);
      } else {
        await axiosInstance.post("/tasks", task);
      }
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      navigate("/tasks");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">{isEdit ? "Update Task" : "Create Task"}</h1>
          {isEdit && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100"
            >
              <LuTrash2 size={14} /> Delete
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Task Title</label>
            <input
              className="input-box"
              placeholder="Create App UI"
              value={task.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              className="input-box min-h-[90px] resize-y"
              placeholder="Describe task"
              value={task.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
              <select
                className="input-box"
                value={task.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
              <input
                type="date"
                className="input-box"
                value={task.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Assign To</label>
              <button
                type="button"
                onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 text-sm text-primary border border-gray-200 rounded-lg px-3 py-2.5 w-full justify-center hover:bg-gray-50"
              >
                {assignedUsers.length > 0 ? (
                  <div className="flex -space-x-2">
                    {assignedUsers.slice(0, 3).map((u) => (
                      <img
                        key={u._id}
                        src={u.profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`}
                        className="w-6 h-6 rounded-full border-2 border-white object-cover"
                        alt={u.name}
                      />
                    ))}
                    {assignedUsers.length > 3 && (
                      <span className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-[10px] flex items-center justify-center">
                        +{assignedUsers.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <LuUsers size={16} /> Add Members
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">TODO Checklist</label>
            {task.todoChecklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 mb-2"
              >
                <span className="text-sm text-gray-700">
                  {String(idx + 1).padStart(2, "0")} {item.text}
                </span>
                <button onClick={() => removeChecklistItem(idx)}>
                  <LuTrash2 size={15} className="text-rose-400 hover:text-rose-600" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                className="input-box"
                placeholder="Enter Task"
                value={checklistInput}
                onChange={(e) => setChecklistInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addChecklistItem())}
              />
              <button
                onClick={addChecklistItem}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 rounded-lg whitespace-nowrap"
              >
                <LuPlus size={16} /> Add
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Add Attachments</label>
            {task.attachments.map((link, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 mb-2"
              >
                <span className="text-sm text-gray-700 truncate">{link}</span>
                <button onClick={() => removeAttachment(idx)}>
                  <LuTrash2 size={15} className="text-rose-400 hover:text-rose-600" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                className="input-box"
                placeholder="Add File Link"
                value={attachmentInput}
                onChange={(e) => setAttachmentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAttachment())}
              />
              <button
                onClick={addAttachment}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 rounded-lg whitespace-nowrap"
              >
                <LuPlus size={16} /> Add
              </button>
            </div>
          </div>

          {error && <p className="text-rose-600 text-xs">{error}</p>}

          <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "UPDATE TASK" : "CREATE TASK"}
          </button>
        </div>
      </div>

      {showUserModal && (
        <SelectUsersModal
          selectedIds={task.assignedTo}
          onClose={() => setShowUserModal(false)}
          onDone={async (ids) => {
            handleChange("assignedTo", ids);
            try {
              const res = await axiosInstance.get("/users");
              setAssignedUsers(res.data.filter((u) => ids.includes(u._id)));
            } catch (err) {
              console.error(err);
            }
            setShowUserModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Delete Task</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400">✕</button>
            </div>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this task?</p>
            <div className="flex justify-end">
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreateTask;
