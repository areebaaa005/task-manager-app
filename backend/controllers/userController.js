import User from "../models/User.js";
import Task from "../models/Task.js";

// @desc Get all team members with their task counts
// @route GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [pending, inProgress, completed] = await Promise.all([
          Task.countDocuments({ assignedTo: user._id, status: "Pending" }),
          Task.countDocuments({ assignedTo: user._id, status: "In Progress" }),
          Task.countDocuments({ assignedTo: user._id, status: "Completed" }),
        ]);
        return { ...user.toObject(), pending, inProgress, completed };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get a single user by id
// @route GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
