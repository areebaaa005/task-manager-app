import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutGrid,
  LuClipboardCheck,
  LuCirclePlus,
  LuUsers,
  LuLogOut,
  LuCamera,
  LuX,
} from "react-icons/lu";
import { useAuth } from "../context/AuthContext.jsx";
import ChangePhotoModal from "./ChangePhotoModal.jsx";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary/10 text-primary border-r-2 border-primary"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <>
      {/* Backdrop, mobile only, shown while the drawer is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-gray-100 flex flex-col overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:z-auto md:w-64 md:max-w-none md:min-h-screen`}
      >
        <div className="flex justify-end p-4 md:hidden">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close menu">
            <LuX size={22} />
          </button>
        </div>

        <div className="flex flex-col items-center px-4 pb-6 md:pt-6">
          <button
            type="button"
            onClick={() => setShowPhotoModal(true)}
            className="relative group"
            title="Change profile photo"
          >
            <img
              src={
                user?.profileImageUrl ||
                `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}`
              }
              alt={user?.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
            />
            <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <LuCamera size={18} className="text-white" />
            </span>
            {isAdmin && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </button>
          <h3 className="mt-4 font-semibold text-gray-900 text-center break-words">{user?.name}</h3>
          <p className="text-xs text-gray-500 text-center break-all">{user?.email}</p>
        </div>

        <nav className="flex flex-col gap-1 w-full px-4 flex-1">
          <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
            <LuLayoutGrid size={18} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/tasks" className={linkClass} onClick={onClose}>
            <LuClipboardCheck size={18} /> <span>{isAdmin ? "Manage Tasks" : "My Tasks"}</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/create-task" className={linkClass} onClick={onClose}>
              <LuCirclePlus size={18} /> <span>Create Task</span>
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/team-members" className={linkClass} onClick={onClose}>
              <LuUsers size={18} /> <span>Team Members</span>
            </NavLink>
          )}
        </nav>

        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 w-full"
          >
            <LuLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {showPhotoModal && <ChangePhotoModal onClose={() => setShowPhotoModal(false)} />}
    </>
  );
};

export default Sidebar;
