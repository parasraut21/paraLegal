
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, type ResetPasswordInput } from "../lib/schema"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { resetPasswordAction } from "@/app/actions";

export function ResetPasswordForm({ message }: { message: any }) {
  // const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword)
    
     await resetPasswordAction(formData); // Import this action appropriately

    // Handle any server-side errors if needed
    // if (result.error) {
    //   setServerError(result.error);
    // } else {
    //   // Handle successful password reset (e.g., redirect or show a success message)
    // }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full max-w-md gap-2 [&>input]:mb-4  rounded-md sm:p-6">
      <h1 className="text-2xl font-medium">Reset Password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New Password</Label>
      <Input
        type="password"
        id="password"
        {...form.register("password")}
        placeholder="New password"
      />
      {form.formState.errors.password && (
        <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
      )}
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <Input
        type="password"
        id="confirmPassword"
        {...form.register("confirmPassword")}
        placeholder="Confirm password"
      />
      {form.formState.errors.confirmPassword && (
        <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
      )}
      <SubmitButton type="submit">
        Reset Password
      </SubmitButton>
      <FormMessage message={message} />
      {/* {serverError && <p className="text-sm text-red-500">{serverError}</p>} */}
    </form>
  );
}
