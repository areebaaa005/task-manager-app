import React from "react";
import { useNavigate } from "react-router-dom";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

const statusStyles = {
  Pending: "bg-violet-100 text-violet-700",
  "In Progress": "bg-cyan-100 text-cyan-700",
  Completed: "bg-green-100 text-green-700",
};

const priorityStyles = {
  Low: "bg-emerald-100 text-emerald-700",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-rose-100 text-rose-700",
};

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const total = task.todoChecklist?.length || 0;
  const done = task.todoChecklist?.filter((t) => t.completed).length || 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
      className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-3"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`badge ${statusStyles[task.status]}`}>{task.status}</span>
        <span className={`badge ${priorityStyles[task.priority]}`}>{task.priority} Priority</span>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      </div>

      <div>
        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
          <span>Task Done: {done} / {total}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-gray-500">
        <div>
          <p className="font-medium text-gray-400">Start Date</p>
          <p>{moment(task.createdAt).format("Do MMM YYYY")}</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-400">Due Date</p>
          <p>{moment(task.dueDate).format("Do MMM YYYY")}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {task.assignedTo?.slice(0, 3).map((u) => (
            <img
              key={u._id}
              src={u.profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`}
              alt={u.name}
              title={u.name}
              className="w-7 h-7 rounded-full border-2 border-white object-cover"
            />
          ))}
          {task.assignedTo?.length > 3 && (
            <span className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 text-[10px] flex items-center justify-center font-medium text-gray-600">
              +{task.assignedTo.length - 3}
            </span>
          )}
        </div>
        {task.attachments?.length > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            <LuPaperclip size={12} /> {task.attachments.length}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
