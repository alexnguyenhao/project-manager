import { Header } from "@/components/layout/header";
import { SidebarComponent } from "@/components/layout/sidebar-componet";
import { Loader } from "@/components/ui/Loader";
import { CreateWorkspace } from "@/components/Workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { useState } from "react";
import { Navigate, Outlet } from "react-router";

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchData("/workspaces")]);
    return { workspaces };
  } catch (error) {}
};

const dashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCreateingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  if (isLoading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };
  return (
    <div className="flex h-screen w-full">
      <SidebarComponent currentWorkspace={currentWorkspace} />
      <div className="flex flex-1 flex-col h-full">
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => {
            setIsCreatingWorkspace(true);
          }}
        />
        {/* <Headers */}
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <CreateWorkspace
        isCreatingWorkspace={isCreateingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default dashboardLayout;
