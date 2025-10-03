import mongoose, { Schema } from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
      maxlength: [100, "Workspace name must be at most 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be at most 500 characters"],
    },
    color: {
      type: String,
      required: true,
      default: "#3B82F6", // default Blue
      validate: {
        validator: function (v) {
          return /^#([0-9A-F]{3}){1,2}$/i.test(v); // hex color validation
        },
        message: (props) => `${props.value} is not a valid hex color!`,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link to user who created workspace
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["owner", "admin", "member", "viewer"],
          default: "member",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
