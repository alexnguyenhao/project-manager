import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace is required"],
    },

    status: {
      type: String,
      enum: ["Planning", "In Progress", "On-Hold", "Completed", "Cancelled"],
      default: "Planning",
    },

    startDate: {
      type: Date,
      default: () => new Date(),
    },

    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.startDate || value >= this.startDate;
        },
        message: "Due date must be greater than or equal to start date",
      },
    },

    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot be more than 100"],
    },

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["manager", "contributor", "viewer"],
          default: "contributor",
        },
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
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

const Project = mongoose.model("Project", projectSchema);

export default Project;
