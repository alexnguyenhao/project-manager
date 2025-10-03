import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/Loader";
import { CreateWorkspace } from "@/components/Workspace/create-workspace";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";
import { PlusCircle, User2, Users } from "lucide-react";
import { useState } from "react";
import { NoDataFound } from "./no-data-found";
import { Link } from "react-router"; // ✅ react-router-dom instead of react-router
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { WorkspaceAvatar } from "@/components/Workspace/workspace-avatar";
import { format, formatDate } from "date-fns"; // ✅ import format properly

const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspaces = [], isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>
          <Button onClick={() => setIsCreatingWorkspace(true)}>
            <PlusCircle className="size-4 mr-2" />
            New Workspace
          </Button>
        </div>

        {workspaces.length === 0 ? (
          <NoDataFound
            title="No Workspaces Found"
            description="Create your first workspace to get started."
            buttonText="New Workspace"
            onButtonClick={() => setIsCreatingWorkspace(true)}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <WorkspaceCard key={ws._id} workspace={ws} />
            ))}
          </div>
        )}
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  const createdAt = workspace.createdAt
    ? format(new Date(workspace.createdAt), "MMM d, yyyy h:mm a")
    : "N/A";
  const memberCount = workspace.members ? workspace.members.length : 0;

  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="hover:shadow-md transition cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />
              <div>
                <CardTitle>{workspace.name}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  Created at {createdAt}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4 mr-1" />
              <span className="text-xs">{memberCount}</span>
            </div>
          </div>
          <CardDescription>
            {workspace.description || "No description"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            View workspace details and projects
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspaces;
