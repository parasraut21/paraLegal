import { z } from "zod";

// Regular expressions for password validation
const passwordRequirements = {
  capital: /[A-Z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

// Custom error message for password requirements
// const getPasswordError = (value: string) => {
//   const errors = [];
//   if (!passwordRequirements.capital.test(value)) errors.push("one uppercase letter");
//   if (!passwordRequirements.number.test(value)) errors.push("one number");
//   if (!passwordRequirements.special.test(value)) errors.push("one special character");
  
//   if (errors.length === 0) return null;
//   return `Password must contain ${errors.join(", ")}`;
// };

// Password validation function
const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password must be less than 100 characters")
  .refine(
    (value) => passwordRequirements.capital.test(value),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (value) => passwordRequirements.number.test(value),
    "Password must contain at least one number"
  )
  .refine(
    (value) => passwordRequirements.special.test(value),
    "Password must contain at least one special character"
  );

export const SignUpSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export type SignInInput = z.infer<typeof SignInSchema>;

export const ResetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;