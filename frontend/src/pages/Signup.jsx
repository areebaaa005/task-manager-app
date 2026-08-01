import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import axiosInstance from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import AuthSidePanel from "../components/AuthSidePanel.jsx";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", adminInviteToken: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const uploadProfileImage = async () => {
    if (!profileImage) return null;
    const formData = new FormData();
    formData.append("image", profileImage);
    const { data } = await axiosInstance.post("/auth/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      const profileImageUrl = await uploadProfileImage();
      const { data } = await axiosInstance.post("/auth/signup", { ...form, profileImageUrl });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-10">
        <h2 className="text-lg font-bold mb-8">Task Manager</h2>

        <div className="max-w-md w-full mx-auto md:mx-0">
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">Join us today by entering your details below.</p>

          <ProfilePhotoSelector image={profileImage} onChange={setProfileImage} />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input
                  name="name"
                  className="input-box"
                  placeholder="John"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <input
                  name="email"
                  type="email"
                  className="input-box"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="input-box pr-10"
                    placeholder="Min 8 Characters"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Admin Invite Token</label>
                <input
                  name="adminInviteToken"
                  className="input-box"
                  placeholder="6 Digit Code"
                  value={form.adminInviteToken}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <p className="text-rose-600 text-xs">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "SIGN UP"}
            </button>

            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <AuthSidePanel />
    </div>
  );
};

export default Signup;
