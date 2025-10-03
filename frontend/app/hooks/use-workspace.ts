import type { WorkspaceForm } from "@/components/Workspace/create-workspace"
import { fetchData, postData } from "@/lib/fetch-util"
import { useMutation, useQuery } from "@tanstack/react-query"


export const useCreateWorkspace =()=>{
    return useMutation({
        mutationFn:async (data:WorkspaceForm)=> postData("/workspaces",data)
    })
};
export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["Workspaces"],   
    queryFn: async () => fetchData("/workspaces"),
  });
};

export const useGetWorkspaceQuery =(workspaceId:string)=>{
    return useQuery({
        queryKey:["workspace",workspaceId],
        queryFn:async()=>fetchData(`/workspaces/${workspaceId}/projects`),
    })
}