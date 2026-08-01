import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateChecklist,
  getDashboardData,
  exportTasksReport,
  exportUsersReport,
} from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard-data", protect, getDashboardData);
router.get("/export/tasks", protect, adminOnly, exportTasksReport);
router.get("/export/users", protect, adminOnly, exportUsersReport);

router.route("/").get(protect, getTasks).post(protect, adminOnly, createTask);
router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, adminOnly, updateTask)
  .delete(protect, adminOnly, deleteTask);

router.put("/:id/checklist", protect, updateChecklist);

export default router;
