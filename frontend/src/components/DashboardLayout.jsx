import React, { useState } from "react";
import { LuMenu } from "react-icons/lu";
import Sidebar from "./Sidebar.jsx";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-gray-600 hover:text-gray-900 -ml-1 p-1"
          aria-label="Open menu"
        >
          <LuMenu size={22} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Task Manager</h1>
      </header>
      <div className="flex flex-col md:flex-row">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
