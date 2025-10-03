import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";
import { TaskStatus, type Project, type Task } from "@/types";
import { cn } from "@/lib/utils";
import { getProjectProgress, getTaskStatusColor } from "@/lib";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { UseProjectQuery } from "@/hooks/use-project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPriorityColor } from "@/lib/index";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();
  const [isCreateTask, setIsCreateTask] = useState(false);

  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-red-500">Project not found</p>;
  }

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BackButton />
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500">{project.description}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-32">
            <div className="text-sm text-muted-foreground">Progress:</div>
            <div className="flex-1">
              <Progress value={projectProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {projectProgress}%
            </span>
          </div>
          <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
          <div className="flex items-center text-sm gap-2">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="outline" className="bg-background">
              {tasks.filter((t) => t.status === TaskStatus.TODO).length} To Do
            </Badge>
            <Badge variant="outline" className="bg-background">
              {tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length}{" "}
              In Progress
            </Badge>
            <Badge variant="outline" className="bg-background">
              {tasks.filter((t) => t.status === TaskStatus.DONE).length} Done
            </Badge>
          </div>
        </div>

        {/* All */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              title={TaskStatus.TODO}
              tasks={tasks}
              onTaskClick={handleTaskClick}
            />
            <TaskColumn
              title={TaskStatus.IN_PROGRESS}
              tasks={tasks}
              onTaskClick={handleTaskClick}
            />
            <TaskColumn
              title={TaskStatus.DONE}
              tasks={tasks}
              onTaskClick={handleTaskClick}
            />
          </div>
        </TabsContent>

        {/* Single Column */}
        <TabsContent value="todo">
          <TaskColumn
            title={TaskStatus.TODO}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            isFullWidth
          />
        </TabsContent>

        <TabsContent value="in-progress">
          <TaskColumn
            title={TaskStatus.IN_PROGRESS}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            isFullWidth
          />
        </TabsContent>

        <TabsContent value="done">
          <TaskColumn
            title={TaskStatus.DONE}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            isFullWidth
          />
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetails;

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

export const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  const filtered = tasks.filter((t) => t.status === title);

  return (
    <div
      className={
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex-1 min-w-[250px]"
      }
    >
      <div className="flex justify-between items-center mb-2 col-span-full">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs text-muted-foreground">{filtered.length}</span>
      </div>

      <div className={isFullWidth ? "contents" : "space-y-3"}>
        {filtered.length > 0 ? (
          filtered.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task._id)}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground col-span-full">
            No tasks yet
          </p>
        )}
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        <div className="flex items-center gap-2">
          {/* Priority Badge */}
          {task.priority && (
            <Badge
              variant="outline"
              className={`text-xs ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </Badge>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};
