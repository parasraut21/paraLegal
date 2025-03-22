import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
// import Navbar from "@/components/HomePage/Navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  return (
    <>
    <div className="w-full bg-[#1C1C1C] pt-10 min-h-screen flex flex-col ">
    {/* <Navbar /> */}
   
    <div className="flex justify-center items-center px-4 w-full h-full ">


      <div className="w-full max-w-md">
        <form className="flex flex-col p-8 rounded-md shadow-lg gap-4 text-foreground bg-white">
          <div>
            <h1 className="text-2xl font-medium">Reset Password</h1>
            <p className="text-sm text-secondary-foreground">
              Already have an account?{" "}
              <Link className="text-primary underline" href="/sign-in">
                Sign in
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
            <SubmitButton formAction={forgotPasswordAction}>
              Reset Password
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
    </div>
    </>

  );
}
