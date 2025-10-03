import type { CreateProjectFormData } from "@/components/project/create-project";
import type { Project, Task } from "@/types";
import { fetchData, postData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ProjectWithTasks = {
  project: Project;
  tasks: Task[];
};

export const UseCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      projectData: CreateProjectFormData;
      workspaceId: string;
    }) =>
      postData(
        `projects/${data.workspaceId}/create-project`,
        data.projectData
      ),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.workspace],
      });
    },
  });
};

export const UseProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: ()=> fetchData(`/projects/${projectId}/tasks`)
  });
};
