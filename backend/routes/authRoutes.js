import express from "express";
import { signup, login, getProfile, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// @desc Upload a profile image to Cloudinary, returns a permanent URL
// @route POST /api/auth/upload-image
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: "task-manager-profiles", resource_type: "image" },
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Image upload failed", error: error.message });
      }
      res.status(200).json({ imageUrl: result.secure_url });
    }
  );
  stream.end(req.file.buffer);
});

export default router;
