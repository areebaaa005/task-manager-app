import React, { useEffect, useState } from "react";
import { LuFileDown } from "react-icons/lu";
import DashboardLayout from "../components/DashboardLayout.jsx";
import axiosInstance from "../api/axios.js";

const TeamMembers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const res = await axiosInstance.get("/tasks/export/users", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_task_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Team Members</h1>
        <button
          onClick={handleDownloadReport}
          className="flex items-center justify-center gap-2 bg-lime-100 text-lime-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-lime-200 transition-colors self-start sm:self-auto"
        >
          <LuFileDown size={14} /> Download Report
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading team members...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {users.map((u) => (
            <div key={u._id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={u.profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`}
                  className="w-11 h-11 rounded-full object-cover"
                  alt={u.name}
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="badge bg-violet-100 text-violet-700 text-center">
                  {u.pending} Pending
                </span>
                <span className="badge bg-cyan-100 text-cyan-700 text-center">
                  {u.inProgress} In Progress
                </span>
                <span className="badge bg-green-100 text-green-700 text-center">
                  {u.completed} Completed
                </span>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-sm text-gray-400 col-span-full text-center py-10">
              No team members yet.
            </p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeamMembers;
