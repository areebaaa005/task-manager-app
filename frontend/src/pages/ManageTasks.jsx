import React, { useEffect, useState } from "react";
import { LuFileDown } from "react-icons/lu";
import DashboardLayout from "../components/DashboardLayout.jsx";
import TaskCard from "../components/TaskCard.jsx";
import axiosInstance from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const TABS = [
  { key: "", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "In Progress", label: "In Progress" },
  { key: "Completed", label: "Completed" },
];

const ManageTasks = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ all: 0, pending: 0, inProgress: 0, completed: 0 });
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (status = "") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/tasks", { params: status ? { status } : {} });
      setTasks(res.data.tasks);
      setSummary(res.data.statusSummary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleDownloadReport = async () => {
    try {
      const res = await axiosInstance.get("/tasks/export/tasks", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">{isAdmin ? "Manage Tasks" : "My Tasks"}</h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex bg-white border border-gray-100 rounded-lg p-1 gap-1 overflow-x-auto max-w-full">
            {TABS.map((tab) => {
              const count =
                tab.key === "" ? summary.all
                : tab.key === "Pending" ? summary.pending
                : tab.key === "In Progress" ? summary.inProgress
                : summary.completed;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === tab.key ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`text-[10px] px-1.5 rounded-full ${
                      activeTab === tab.key ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {isAdmin && (
            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center gap-2 bg-lime-100 text-lime-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-lime-200 transition-colors shrink-0"
            >
              <LuFileDown size={14} /> Download Report
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
          No tasks found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageTasks;
