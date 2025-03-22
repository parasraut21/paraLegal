
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, type SignInInput } from "../lib/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/form-message";
import Link from "next/link";
import { useState } from "react";
import { signInAction } from "@/app/actions"; 
import { Button } from "./ui/button";
import posthog from "posthog-js";
import { Eye, EyeOff } from "lucide-react";
export function SignInForm({ message }: { message: any }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignInInput) => {
    posthog.identify(
      data.email, // Use the email as the distinct_id
      { email: data.email } // Set the email as a property
    );
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signInAction(formData);

    if (!result.success) {
      setServerError(result.message);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full mx-auto">
      <h1 className="text-2xl font-medium">Sign In</h1>
      <p className="text-sm text-foreground mt-2">
        Don&apos;t have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign Up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          className="text-[1rem]"
          {...form.register("email")}
          placeholder="you@example.com"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <Label htmlFor="password">Password</Label>
          <Link className="text-xs text-foreground underline" href="/forgot-password">
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            
            type={showPassword ? "text" : "password"}
            {...form.register("password")}
            placeholder="Your password"
            className="mt-2 pr-10 text-[1rem]"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 top-1 flex items-center pr-3"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
        )}
        <Button
          variant="default"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
        {serverError && <p className="text-sm text-red-500 text-center">{serverError}</p>}
        <FormMessage message={message} />
      </div>
    </form>
  );
}
