import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router"; // 👈 if you use react-router
import { Button } from "../ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { title: "Dashboard", href: `/dashboard`, icon: LayoutDashboard },
    { title: "Workspaces", href: `/workspaces`, icon: Users },
    { title: "My Tasks", href: `/my-tasks`, icon: ListCheck },
    { title: "Members", href: `/members`, icon: Users },
    { title: "Achieved", href: `/achieved`, icon: LayoutDashboard },
    { title: "Settings", href: `/settings`, icon: Settings },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16 md:w-[80px]" : "w-[240px]"
      )}
    >
      <div className=" flex h-14 items-center border-b px-4 mb-4">
        <Link to={"/dashboard"} className=" flex items-center">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Wrench className="size-6 text-blue-600" />
              <span className="font-semibold text-lg hidden:md:block">
                TaskHub
              </span>
            </div>
          )}
          {isCollapsed && <Wrench className="size-6 text-blue-600" />}
        </Link>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="ml-auto hidden md:block"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronsRightIcon className="size-4" />
          ) : (
            <ChevronsLeftIcon className="size-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-2")}
          currentWorkspace={currentWorkspace}
        />
      </ScrollArea>
      <div>
        <Button
          variant={"ghost"}
          size={isCollapsed ? "icon" : "default"}
          onClick={logout}
        >
          <LogOut className={cn("size-4", isCollapsed && "mr-2 ")} />
          <span className="hidden md:block">Logout</span>
        </Button>
      </div>
    </div>
  );
};
