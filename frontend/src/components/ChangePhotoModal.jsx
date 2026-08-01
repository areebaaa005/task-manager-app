import React, { useState } from "react";
import { LuX } from "react-icons/lu";
import axiosInstance from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import ProfilePhotoSelector from "./ProfilePhotoSelector.jsx";

const ChangePhotoModal = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!image) {
      setError("Please select a photo first.");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      const { data: uploadData } = await axiosInstance.post("/auth/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { data } = await axiosInstance.put("/auth/profile", {
        profileImageUrl: uploadData.imageUrl,
      });

      updateUser({ ...user, profileImageUrl: data.profileImageUrl });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-gray-900">Change Profile Photo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <LuX size={18} />
          </button>
        </div>

        <ProfilePhotoSelector image={image} onChange={setImage} currentImageUrl={user?.profileImageUrl} />

        {error && <p className="text-rose-600 text-xs text-center mt-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePhotoModal;
