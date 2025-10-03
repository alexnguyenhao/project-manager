import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "@/hooks/use-workspace";
import { toast } from "sonner";
import { useNavigate } from "react-router"; // ✅ fixed import

interface CreateWorkspaceProps {
  isCreatingWorkspace: boolean;
  setIsCreatingWorkspace: (isCreating: boolean) => void;
}

export const colorOptions = [
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Lime", value: "#84CC16" },
  { name: "Green", value: "#22C55E" },
  { name: "Emerald", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Purple", value: "#A855F7" },
  { name: "Fuchsia", value: "#D946EF" },
  { name: "Pink", value: "#EC4899" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Gray", value: "#6B7280" },
  { name: "Slate", value: "#475569" },
];

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

export const CreateWorkspace = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0].value,
      description: "",
    },
  });

  const navigate = useNavigate();
  const { mutate, isPending } = useCreateWorkspace();

  const onSubmit = (data: WorkspaceForm) => {
    mutate(data, {
      onSuccess: (data: any) => {
        form.reset();
        setIsCreatingWorkspace(false);
        toast.success("Workspace created successfully");
        navigate(`/workspaces/${data._id}`);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || "Failed to create workspace";
        toast.error(errorMessage);
        console.error(error);
      },
    });
  };

  return (
    <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace}>
      <DialogContent className="max-h-[80vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Workspace
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Workspace Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter workspace name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a short description..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Picker */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Color</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-6 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          type="button"
                          key={color.value}
                          title={color.name} // ✅ accessibility
                          className={`w-8 h-8 rounded-full border-2 transition ${
                            field.value === color.value
                              ? "ring-2 ring-offset-2 ring-black"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => field.onChange(color.value)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer Actions */}
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreatingWorkspace(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
