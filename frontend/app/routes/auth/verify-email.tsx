import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft, XCircle, Loader, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/hooks/use-auth";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending: isVerifying } = useVerifyEmailMutation();
  useEffect(() => {
    // simulate verification (later replace with API call)
    if (token) {
      mutate(
        { token },
        {
          onSuccess: () => {
            setIsSuccess(true);
          },
          onError: (error: any) => {
            const errorMessage =
              error.response?.data?.message || "An error occurred";
            setIsSuccess(false);
            console.log(error);
            toast.error(errorMessage);
          },
        }
      );
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen   px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-center py-6">
          <h1 className="text-2xl font-bold">Email Verification</h1>
          <p className="text-sm opacity-90">Confirm your email address</p>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 ">
            {isVerifying ? (
              <>
                <Loader className="w-10 h-10 text-gray-500 animate-s" />
                <h3 className="text-lg font-semibold">Verifying email.....</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email.
                </p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500 " />
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500">
                  Your email has been verified successfully
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 text-red-500"></XCircle>
                <h3 className="text-lg font-semibold">
                  Email Verification falsed
                </h3>
                <p className="text-sm text-gray-500">
                  Your email verifycation falsed. Please try again
                </p>
              </>
            )}
          </div>
        </CardContent>
        {/* Footer */}
        <CardFooter className="flex justify-center py-6 bg-gray-50">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/sign-in">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
//2:36:07

export default VerifyEmail;
