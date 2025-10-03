import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    dueDate: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    estimatedHours: {
      type: Number,
      min: [0, "Estimated hours cannot be negative"],
    },

    actualHours: {
      type: Number,
      min: [0, "Actual hours cannot be negative"],
    },

    tags: [{ type: String, trim: true }],

    subtasks: [
      {
        title: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String },
        fileSize: { type: Number, min: 0 },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
