import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
// Create workspace
const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    return res.status(201).json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    return res.status(500).json({
      message: "Failed to create workspace",
      error: error.message,
    });
  }
};

// Get workspaces
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id, // check membership
    })
      .sort({ createdAt: -1 }) // fix field name
      .populate("owner", "name email") // lấy thêm info owner
      .populate("members.user", "name email"); // lấy thêm info members

    return res.status(200).json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return res.status(500).json({
      message: "Failed to fetch workspaces",
      error: error.message,
    });
  }
};

const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Tìm workspace theo id + kiểm tra membership
    const workspace = await Workspace.findOne({
      _id: workspaceId, // chỗ này thay vì workspaceId
      "members.user": req.user._id,
    })
      .populate("owner", "name email profilePicture")
      .populate("members.user", "name email profilePicture");

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or access denied" });
    }

    return res.status(200).json(workspace);
  } catch (error) {
    console.error("Error fetching workspace details:", error);
    return res.status(500).json({
      message: "Failed to fetch workspace details",
      error: error.message,
    });
  }
};
const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check if user is member
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    })
      .populate("owner", "name email profilePicture")
      .populate("members.user", "name email profilePicture");

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or access denied" });
    }

    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
      // members: { $in: [req.user._id] },
    })
      .populate("status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ projects, workspace });
  } catch (error) {
    console.error("Error fetching workspace projects:", error);
    return res.status(500).json({
      message: "Failed to fetch workspace projects",
      error: error.message,
    });
  }
};
export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
};
