// app/(auth-pages)/sign-up/page.tsx
import { FormMessage, Message } from "@/components/form-message";
import { SignUpForm } from "@/components/SignUpForm";


export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
    <div className="flex w-full min-h-screen bg-[#1C1C1C] flex-col gap-8 pt-10">


      <div className="flex md:pr-32 md:pl-32 justify-center h-[500px] w-full ">

        <div className=" bg-white mt-8 w-full mr-2 ml-2 sm:w-1/2 md:w-1/2 lg:w-1/3 shadow-xl rounded-sm flex items-center justify-center p-8">
          <SignUpForm message={searchParams} />
        </div>
      </div>
    </div>

    </>
  );
}