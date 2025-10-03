import { useCreateTaskMutation } from "@/hooks/use-task";
import { createTaskSchema } from "@/lib/schema";
import type { ProjectMemberRole, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "sonner";
import type z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const CreateTaskDialog = ({
  open,
  onOpenChange,
  projectId,
  projectMembers,
}: CreateTaskDialogProps) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignees: [],
    },
  });

  const { mutate, isPending } = useCreateTaskMutation();

  const onSubmit = (values: CreateTaskFormData) => {
    mutate(
      { projectId, taskData: values },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message || "Failed to create task";
          toast.error(msg);
          console.error(error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        {/* Wrap form with FormProvider */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title" {...field} />
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
                          {...field}
                          rows={3}
                          placeholder="Enter description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status & Priority */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="To Do">To Do</SelectItem>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Due Date */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a due date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(date?.toISOString() || "")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Assignees */}
                <FormField
                  control={form.control}
                  name="assignees"
                  render={({ field }) => {
                    const selectedMembers = field.value || [];
                    const displayText =
                      selectedMembers.length === 0
                        ? "Select assignees"
                        : selectedMembers.length <= 2
                          ? selectedMembers
                              .map(
                                (id) =>
                                  projectMembers.find((m) => m.user._id === id)
                                    ?.user.name
                              )
                              .filter(Boolean)
                              .join(", ")
                          : `${selectedMembers.length} assignees selected`;

                    return (
                      <FormItem>
                        <FormLabel>Assignees</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal min-h-11",
                                  selectedMembers.length === 0 &&
                                    "text-muted-foreground"
                                )}
                              >
                                {displayText}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-sm max-h-60 overflow-y-auto p-2"
                              align="start"
                            >
                              <div className="flex flex-col gap-2">
                                {projectMembers.map((member) => {
                                  const isSelected = selectedMembers.includes(
                                    member.user._id
                                  );
                                  return (
                                    <Button
                                      key={member.user._id}
                                      variant={isSelected ? "default" : "ghost"}
                                      onClick={() => {
                                        if (isSelected) {
                                          field.onChange(
                                            selectedMembers.filter(
                                              (id) => id !== member.user._id
                                            )
                                          );
                                        } else {
                                          field.onChange([
                                            ...selectedMembers,
                                            member.user._id,
                                          ]);
                                        }
                                      }}
                                      className="justify-between"
                                    >
                                      <span>{member.user.name}</span>
                                      {isSelected && <span>✓</span>}
                                    </Button>
                                  );
                                })}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
