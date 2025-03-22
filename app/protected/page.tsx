import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOutAction } from "../actions";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className=" w-full flex flex-col justify-center items-center h-screen gap-12 border-2 ">
   
      <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign Out
        </Button>
      </form>
    </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
      </div>
    </div>
  );
}
