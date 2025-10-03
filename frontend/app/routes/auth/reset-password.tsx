import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { useResetPasswordMutation } from "@/hooks/use-auth";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ state toggle hiển thị password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useResetPasswordMutation();

  const handleSubmit = (values: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }
    mutate(
      { ...values, token: token as string },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Password reset successfully");
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "An error occurred";
          toast.error(errorMessage);
        },
      }
    );
  };

  // ✅ Auto redirect sau 3s khi thành công
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-xl relative">
        {/* Icon quay lại */}
        <button
          onClick={() => navigate("/sign-in")}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {isSuccess
              ? "Your password has been reset successfully."
              : "Enter your new password below"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <p className="text-green-600 font-medium">
                ✅ Password reset successfully! Redirecting...
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="*******"
                            className="w-full px-3 py-2 border rounded-md pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="*******"
                            className="w-full px-3 py-2 border rounded-md pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        {!isSuccess && (
          <CardFooter className="flex items-center justify-center mt-6">
            <p className="text-center text-muted-foreground">
              Remembered your password?{" "}
              <Button
                variant="link"
                className="px-0"
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </Button>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
