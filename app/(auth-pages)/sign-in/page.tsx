// Login.tsx

import { Message } from "@/components/form-message";
// import Navbar from "@/components/HomePage/Navbar";

import { SignInForm } from "@/components/SignInForm"; 

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <>
    <div className="w-full flex flex-col gap-8 bg-[#1C1C1C] min-h-screen pt-10">
    {/* <Navbar /> */}
      <div className="flex md:pr-32 md:pl-32 justify-center h-[500px] w-full  ">
     
        <div className="bg-white mt-8 flex items-center w-full mr-2 ml-2 sm:w-1/2 md:w-1/2 lg:w-1/3 shadow-xl   rounded-sm justify-center p-8 ">
          <SignInForm message={searchParams} />
        </div>
      </div>
    </div>
    
    </>
  );
}
