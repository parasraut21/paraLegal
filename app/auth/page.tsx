import { Button } from "@/components/ui/button";
import { auth , signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await auth()
    if (session) redirect("/")
    return (
        <div className="min-h-screen w-full flex justify-center items-center">
            <form
                action={async () => {
                    "use server"
                    await signIn()
                }}
            >
                <Button type="submit">Sign in</Button>
            </form>
        </div>
    )
}