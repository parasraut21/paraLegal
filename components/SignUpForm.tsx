'use client';

import { signUpAction } from "@/app/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, type SignUpInput } from "../lib/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/form-message";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import posthog from "posthog-js";
import { Eye, EyeOff } from "lucide-react";

export function SignUpForm({ message }: { message: any }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onChange"
  });

  const onSubmit = async (data: SignUpInput) => {
    try {
      setServerError(null); // Clear previous error
      posthog.identify(
        data.email, // Use the email as the distinct_id
        { email: data.email } // Set the email as a property
      );
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

       await signUpAction(formData);

      // console.log(result);
      // Handle successful sign up (e.g., redirect, show success message, etc.)
    } catch (error) {
      // setServerError("An error occurred while signing up. Please try again.");
      console.error("Sign-up error:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full mx-auto">
      <h1 className="text-2xl font-medium">Sign Up</h1>
      <p className="text-sm text text-foreground">
        Already have an account?{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Sign In
        </Link>
      </p>

      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="you@example.com"
            className="text-[1rem]"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        
        {/* Password Field */}
        <div className="space-y-2 relative">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              placeholder="Your password"
              className="pr-10 text-[1rem]"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 h-full"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2 relative">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...form.register("confirmPassword")}
              placeholder="Re-enter your password"
              className="pr-10 text-[1rem]"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 h-full"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
        
        <Button 
          type="submit"
          variant='default'
          disabled={form.formState.isSubmitting}
          className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>

        {/* Display server error message */}
        {serverError && (
          <p className="text-sm text-red-500 mt-2">
            {serverError}
          </p>
        )}
        
        <FormMessage message={message} />
      </div>
    </form>
  );
}
