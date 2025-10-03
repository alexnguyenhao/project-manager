import type { TaskStatus } from "@/types";

export const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/reset-password",
  "/forgot-password",
  "/",
];

export const getTaskStatusColor = (status: string): string => {
  switch (status) {
    case "Planning":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "In Progress":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "On-Hold":
      return "bg-gray-200 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};
export const getProjectProgress =(tasks:{status:TaskStatus}[])=>{
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task)=> task?.status ==="Done").length;

    const progress = totalTasks > 0 ? Math.round((completedTasks /totalTasks)*100):0;
    return progress;
}

export const getPriorityColor = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "low":
      return "bg-slate-500 text-white border-green-200";
    case "medium":
      return "bg-orange-500 text-white border-yellow-200";
    case "high":
      return "bg-red-500 text-white border-orange-200";
    default:
      return "bg-gray-100 text-white border-gray-200";
  }
};