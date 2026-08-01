import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attachments: [{ type: String }],
    todoChecklist: [todoSchema],
  },
  { timestamps: true }
);

// Automatically derive status from the checklist completion
taskSchema.methods.recalculateStatus = function () {
  const total = this.todoChecklist.length;
  const completed = this.todoChecklist.filter((t) => t.completed).length;

  if (total === 0) {
    // leave status as-is if there's no checklist to derive from
    return;
  }
  if (completed === 0) {
    this.status = "Pending";
  } else if (completed === total) {
    this.status = "Completed";
  } else {
    this.status = "In Progress";
  }
};

export default mongoose.model("Task", taskSchema);
