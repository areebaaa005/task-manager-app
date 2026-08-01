import React, { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import axiosInstance from "../api/axios.js";

const SelectUsersModal = ({ selectedIds, onClose, onDone }) => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(selectedIds || []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Select Users</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <LuX size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-2">
          {users.map((u) => (
            <label
              key={u._id}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`}
                  className="w-9 h-9 rounded-full object-cover"
                  alt={u.name}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={selected.includes(u._id)}
                onChange={() => toggle(u._id)}
                className="w-4 h-4 accent-primary"
              />
            </label>
          ))}
          {users.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No team members yet.</p>
          )}
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            CANCEL
          </button>
          <button
            onClick={() => onDone(selected)}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectUsersModal;
