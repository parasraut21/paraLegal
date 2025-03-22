import Nav from "@/components/global/Nav";
import { SidebarMain } from "@/components/global/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"


export default async function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth()
    if (!session) redirect("/auth")
    return (
        <SidebarProvider>
            <SidebarMain />
            <section className="relative w-full lg:w-[calc(100-16rem)] h-screen">
                <div className="absolute top-0 left-0 w-full shadow-md">
                    <Nav />
                </div>
                <div className="h-[calc(100vh-4rem)] w-full mt-[4rem] py-4 overflow-y-auto">
                    <div className="px-2 md:px-6 lg:px-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </section>
        </SidebarProvider>
    );
}
