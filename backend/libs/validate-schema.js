import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
});

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Workspace schema
const workspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color")
    .default("#3B82F6"),
});
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum([
    "Planning",
    "In Progress",
    "On Hold",
    "Completed",
    "Canceled",
  ]),
  startDate: z.string().min(10, "Start date is required"),
  dueDate: z.string().min(10, "Due date is required"),
  tags: z.string().optional(),
  members: z.array(
    z
      .object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
      })
      .optional()
  ),
});
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).min(1, "At least one assignee"),
});

export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  emailSchema,
  workspaceSchema,
  projectSchema,
  taskSchema,
};
