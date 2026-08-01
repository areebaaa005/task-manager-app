import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash2 } from "react-icons/lu";

// Lets the user pick a local image, shows a live preview, and exposes the
// selected File object via onChange so the parent can upload it on submit.
// `currentImageUrl` (optional) shows an already-saved photo before a new one is picked.
const ProfilePhotoSelector = ({ image, onChange, currentImageUrl }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onChange(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayUrl = previewUrl || (!image ? currentImageUrl : null);

  return (
    <div className="flex justify-center mb-2">
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!displayUrl ? (
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <LuUser size={32} className="text-primary/60" />
          </div>
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark"
            title="Upload photo"
          >
            <LuUpload size={13} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={displayUrl}
            alt="Profile preview"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
          />
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark"
            title="Change photo"
          >
            <LuUpload size={13} />
          </button>
          {image && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600"
              title="Remove selected photo"
            >
              <LuTrash2 size={11} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
