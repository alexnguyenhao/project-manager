import Task from "../models/task.js";
import Project from "../models/project.js";
import Workspace from "../models/workspace.js";

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assignees } =
      req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const workspace = await Workspace.findById(project.workspace);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (!isMember)
      return res
        .status(401)
        .json({ message: "You are not a member of this workspace" });

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
      project: projectId,
      createdBy: req.user._id,
    });

    project.tasks.push(newTask._id);
    await project.save();
    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
