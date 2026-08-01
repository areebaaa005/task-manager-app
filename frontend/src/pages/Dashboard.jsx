import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import DashboardLayout from "../components/DashboardLayout.jsx";
import axiosInstance from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const COLORS = { pending: "#7C3AED", inProgress: "#06B6D4", completed: "#22C55E" };
const PRIORITY_COLORS = { low: "#22C55E", medium: "#F97316", high: "#EF4444" };

const statusBadge = {
  Pending: "bg-violet-100 text-violet-700",
  "In Progress": "bg-cyan-100 text-cyan-700",
  Completed: "bg-green-100 text-green-700",
};
const priorityBadge = {
  Low: "bg-emerald-100 text-emerald-700",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-rose-100 text-rose-700",
};

const StatCard = ({ color, label, value }) => (
  <div className="flex items-center gap-2">
    <span className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: color }} />
    <span className="text-sm text-gray-600">
      <b className="text-gray-900">{value}</b> {label}
    </span>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/tasks/dashboard-data");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const pieData = data
    ? [
        { name: "Pending", value: data.taskDistribution.pending, color: COLORS.pending },
        { name: "In Progress", value: data.taskDistribution.inProgress, color: COLORS.inProgress },
        { name: "Completed", value: data.taskDistribution.completed, color: COLORS.completed },
      ]
    : [];

  const barData = data
    ? [
        { name: "Low", value: data.taskPriorityLevels.low, color: PRIORITY_COLORS.low },
        { name: "Medium", value: data.taskPriorityLevels.medium, color: PRIORITY_COLORS.medium },
        { name: "High", value: data.taskPriorityLevels.high, color: PRIORITY_COLORS.high },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Good Morning! {user?.name}</h1>
        <p className="text-xs text-gray-400 mb-4">{moment().format("dddd Do MMM YYYY")}</p>
        <div className="flex flex-wrap gap-6">
          <StatCard color="#1B4FE0" label="Total Tasks" value={data?.totalTasks ?? "-"} />
          <StatCard color={COLORS.pending} label="Pending Tasks" value={data?.pendingTasks ?? "-"} />
          <StatCard color={COLORS.inProgress} label="In Progress" value={data?.inProgressTasks ?? "-"} />
          <StatCard color={COLORS.completed} label="Completed Tasks" value={data?.completedTasks ?? "-"} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Task Priority Levels</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#F9FAFB" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Recent Tasks</h2>
          <button
            onClick={() => navigate("/tasks")}
            className="text-xs font-medium text-primary flex items-center gap-1"
          >
            See All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Created On</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentTasks?.map((task) => (
                <tr
                  key={task._id}
                  className="border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  <td className="py-3 pr-4 font-medium text-gray-800">{task.title}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge ${statusBadge[task.status]}`}>{task.status}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`badge ${priorityBadge[task.priority]}`}>{task.priority}</span>
                  </td>
                  <td className="py-3 text-gray-500">{moment(task.createdAt).format("Do MMM YYYY")}</td>
                </tr>
              ))}
              {!data?.recentTasks?.length && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400 text-sm">
                    No tasks yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
