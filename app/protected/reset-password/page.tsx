
import { Message } from "@/components/form-message";
import { ResetPasswordForm } from "@/components/ResetPassWordForm";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#1C1C1C] ">
      <div className="flex items-center w-full mr-2 ml-2 sm:w-1/2 md:w-1/2 lg:w-1/3 shadow-xl   rounded-sm justify-center p-8 ">
      <ResetPasswordForm message={searchParams} />

      </div>
    </div>
  );
}
