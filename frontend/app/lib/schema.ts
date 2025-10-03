import { ProjectStatus } from "@/types";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error will show under confirmPassword
  }
);

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});


export const workspaceSchema = z.object({
  name:z.string().min(3,"Name must be at least 3 characters"),
  color:z.string().min(3,"Color must be at least 3 characters"),
  description:z.string().optional(),
})
export const projectSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(10, "Start date is required"),
    dueDate: z.string().min(10, "Due date is required"),
    members: z.array(
      z
        .object({
          user: z.string(),
          role: z.enum(["manager", "contributor", "viewer"]),
        })
        .optional()
    ),
    tags: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.dueDate) return true; 
      return new Date(data.dueDate) >= new Date(data.startDate);
    },
    {
      message: "Due date cannot be earlier than start date",
      path: ["dueDate"], // báo lỗi ngay tại field dueDate
    }
  );

  export const createTaskSchema = z.object({
    title:z.string().min(1,"title is required"),
    description:z.string().optional(),
    status:z.enum(["To Do", "In Progress","Done"]),
    priority:z.enum(["Low","Medium","High"]),
    dueDate: z.string().min(1, "Due date is required"),
    assignees:z.array(z.string()).min(1,"At least one assignee"),
  })