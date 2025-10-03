export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  profilePicture?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  color: string;
  members: {
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  ON_HOLD = "On-Hold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  workspace: Workspace;
  startDate: Date;
  dueDate?: Date;
  progress: number; // 0-100
  tasks: Task[];
  members: {
    user: User;
    role: "manager" | "contributor" | "viewer";
  }[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Attachment {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: Project;
  status: TaskStatus;
  priority: TaskPriority;
  assignees?: User[] | string[];
  watchers?: User[] | string[];
  dueDate?: Date;
  subtasks: Subtask[];
  comments: string[]; // list comment IDs
  attachments: Attachment[];
  createdBy: User;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberProps{
  _id:string;
  user:User;
  role: "admin" | "member" | "owner" | "viewer";
  joinedAt:Date;
}

export enum ProjectMemberRole {
  MANAGER ="mamager",
  CONTRIBUTOR ="contributor",
  VIEWER = "viewer"
}