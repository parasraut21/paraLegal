"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SignUpSchema } from "@/lib/schema";


export const signUpAction = async (formData: FormData) => {
  // try {
    // Parse and validate the form data
    const validatedFields = SignUpSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("password") 
    });


    // Return early if validation fails
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten();
      return {
        error: errors.fieldErrors.email?.[0] || 
               errors.fieldErrors.password?.[0] || 
               errors.fieldErrors.confirmPassword?.[0] || 
               "Invalid input"
      };
    }

    const { email, password } = validatedFields.data;
    const supabase = await createClient();
    // const origin = (await headers()).get("origin");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/auth/callback`,
      },
    });

    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    } else {
      return encodedRedirect(
        "success",
        "/sign-up",
        "Thanks for signing up! Please check your email for a verification link.",
      );
    }

};

// export const signUpAction = async (formData: FormData) => {
//   const email = formData.get("email")?.toString();
//   const password = formData.get("password")?.toString();
//   const supabase = await createClient();
//   const origin = (await headers()).get("origin");

//   if (!email || !password) {
//     return { error: "Email and password are required" };
//   }

//   const { error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       emailRedirectTo: `${origin}/auth/callback`,
//     },
//   });

//   if (error) {
//     console.error(error.code + " " + error.message);
//     return encodedRedirect("error", "/sign-up", error.message);
//   } else {
//     return encodedRedirect(
//       "success",
//       "/sign-up",
//       "Thanks for signing up! Please check your email for a verification link.",
//     );
//   }
// };

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return redirect("/dashboard");
};




export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  // const origin = (await headers()).get("origin");

  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }


  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `http://localhost:3000/auth/callback?redirect_to=protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  return redirect("/");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};
