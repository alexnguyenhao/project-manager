import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useForgotPasswordMutation } from "@/hooks/use-auth";
import { forgotPasswordSchema } from "@/lib/schema";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false); // ✅ thêm state
  const navigate = useNavigate();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useForgotPasswordMutation();

  const handleSubmit = (values: ForgotPasswordFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Password reset link sent to your email");
        setIsSuccess(true); // ✅ update state
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {isSuccess
              ? "We’ve sent you a reset link. Please check your email."
              : "Enter your email and we’ll send you a reset link"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSuccess ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-3 py-2 border rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center text-green-600 font-medium">
              ✅ Password reset link sent successfully!
            </div>
          )}
        </CardContent>

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
      </Card>
    </div>
  );
};

export default ForgotPassword;
