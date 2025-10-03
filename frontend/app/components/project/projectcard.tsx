import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router";
import { Calendar, Users } from "lucide-react";
import type { Project, Workspace } from "@/types";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import { Progress } from "../ui/progress";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

export const ProjectCard = ({
  project,
  progress,
  workspaceId,
}: ProjectCardProps) => {
  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
      <Card
        className="w-full h-full rounded-2xl border border-gray-200 dark:border-gray-800 
             transition-all duration-300 ease-in-out 
             hover:shadow-xl hover:translate-y-2 hover:scale-[1.02]"
      >
        {/* Header */}
        <CardHeader className="flex flex-row justify-between items-start gap-2">
          {/* Left: Title + Description */}
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {project.title}
            </CardTitle>
            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {project.description}
              </p>
            )}
          </div>

          {/* Right: Status + Members */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className={cn(
                "px-2 py-1 text-xs rounded-full whitespace-nowrap",
                getTaskStatusColor(project.status)
              )}
            >
              {project.status}
            </span>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{project.members?.length ?? 0}</span>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="mt-2 space-y-3">
          {/* Progress */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Metadata */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>{project.tasks?.length ?? 0}</span>
              <span>Task</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {project.dueDate
                  ? new Date(project.dueDate).toLocaleDateString()
                  : "No deadline"}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-end">
          <span className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            View details →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};
