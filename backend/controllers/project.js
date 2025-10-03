import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";

export const createProject = async (req, res) => {
  try {
    // Lấy workspaceId từ params
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    // Tìm workspace theo id
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res
        .status(401)
        .json({ message: "you are not a member of thi worksacpe" });
    }
    const tagArray = tags ? tags.split(",") : [];
    // Tạo project mới
    const newProject = new Project({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      members,
      workspace: workspaceId,
      createdBy: req.user._id,
    });
    await newProject.save();
    // Push project vào workspace (nếu bạn có lưu danh sách project trong Workspace model)
    workspace.projects.push(newProject._id);
    await workspace.save();

    return res.status(201).json({
      message: "Project created successfully",
      newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res
        .status(401)
        .json({ message: "You are not a member of this workspace" });
    }

    return res.status(200).json({
      message: "Project details fetched successfully",
      project,
    });
  } catch (error) {
    console.error("Error getting project details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate("members.user");
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found in this workspace" });
    }

    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res
        .status(401)
        .json({ message: "You are not a member of this workspace" });
    }

    const tasks = await Task.find({ project: projectId, isArchived: false })
      .populate("assignees", "name email profilePicture")
      .populate("createdBy", "name email")
      .sort({ dueDate: 1, priority: -1 });

    return res.status(200).json({
      message: "Project tasks fetched successfully",
      project,
      tasks,
    });
  } catch (error) {
    console.error("Error getting project tasks:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
