import multer from "multer";

// In-memory storage: the file buffer is streamed straight to Cloudinary
// instead of being saved to local disk (Render's free-tier disk is wiped
// on every restart/redeploy, which would otherwise break saved images).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png and .webp images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
