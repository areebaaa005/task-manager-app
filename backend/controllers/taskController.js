import Task from "../models/Task.js";
import User from "../models/User.js";

// @desc Create a new task (Admin only)
// @route POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and due date are required" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get tasks (Admin sees all, member sees only assigned)
// @route GET /api/tasks?status=Pending
export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email profileImageUrl")
      .sort({ createdAt: -1 });

    // Add counts for the tab bar
    const baseFilter = req.user.role !== "admin" ? { assignedTo: req.user._id } : {};
    const [all, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments(baseFilter),
      Task.countDocuments({ ...baseFilter, status: "Pending" }),
      Task.countDocuments({ ...baseFilter, status: "In Progress" }),
      Task.countDocuments({ ...baseFilter, status: "Completed" }),
    ]);

    res.json({
      tasks,
      statusSummary: { all, pending, inProgress, completed },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get single task by id
// @route GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update task details (Admin only)
// @route PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const fields = ["title", "description", "priority", "dueDate", "assignedTo", "attachments"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    if (req.body.todoChecklist !== undefined) {
      task.todoChecklist = req.body.todoChecklist;
      task.recalculateStatus(); // status auto-updates from checklist
    }

    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete a task (Admin only)
// @route DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update just the checklist -> auto recalculates status
// @route PUT /api/tasks/:id/checklist
export const updateChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.todoChecklist = todoChecklist;
    task.recalculateStatus();
    await task.save();

    res.json({ message: "Checklist updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Dashboard data for admin
// @route GET /api/tasks/dashboard-data
export const getDashboardData = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const baseFilter = isAdmin ? {} : { assignedTo: req.user._id };

    const [totalTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
      Task.countDocuments(baseFilter),
      Task.countDocuments({ ...baseFilter, status: "Pending" }),
      Task.countDocuments({ ...baseFilter, status: "In Progress" }),
      Task.countDocuments({ ...baseFilter, status: "Completed" }),
    ]);

    const [low, medium, high] = await Promise.all([
      Task.countDocuments({ ...baseFilter, priority: "Low" }),
      Task.countDocuments({ ...baseFilter, priority: "Medium" }),
      Task.countDocuments({ ...baseFilter, priority: "High" }),
    ]);

    const recentTasks = await Task.find(baseFilter).sort({ createdAt: -1 }).limit(8);

    res.json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      taskDistribution: {
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
      taskPriorityLevels: { low, medium, high },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Export all tasks as CSV (Download Report)
// @route GET /api/tasks/export/tasks
export const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    let csv = "Task ID,Title,Description,Priority,Status,Due Date,Assigned To\n";
    tasks.forEach((task) => {
      const assignedNames = task.assignedTo.map((u) => u.name).join(" | ");
      const row = [
        task._id,
        task.title,
        (task.description || "").replace(/,/g, ";").replace(/\n/g, " "),
        task.priority,
        task.status,
        task.dueDate.toISOString().split("T")[0],
        assignedNames,
      ];
      csv += row.map((val) => `"${val}"`).join(",") + "\n";
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=tasks_report.csv");
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Export a per-user task report as CSV
// @route GET /api/tasks/export/users
export const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email").lean();
    const tasks = await Task.find().populate("assignedTo", "name email");

    const userStatsMap = {};
    users.forEach((u) => {
      userStatsMap[u._id] = {
        name: u.name,
        email: u.email,
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
      };
    });

    tasks.forEach((task) => {
      task.assignedTo.forEach((u) => {
        if (!userStatsMap[u._id]) return;
        userStatsMap[u._id].total += 1;
        if (task.status === "Pending") userStatsMap[u._id].pending += 1;
        if (task.status === "In Progress") userStatsMap[u._id].inProgress += 1;
        if (task.status === "Completed") userStatsMap[u._id].completed += 1;
      });
    });

    let csv = "User Name,Email,Total Assigned Tasks,Pending Tasks,In Progress Tasks,Completed Tasks\n";
    Object.values(userStatsMap).forEach((u) => {
      csv += `"${u.name}","${u.email}",${u.total},${u.pending},${u.inProgress},${u.completed}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=user_task_report.csv");
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
