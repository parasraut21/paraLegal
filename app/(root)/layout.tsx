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
            <section className="relative w-full lg:w-[calc(100-16rem)]">
                <Nav />
                <div className="px-2 md:px-6 lg:px-10 py-4 min-h-[calc(100vh-4rem)] max-w-7xl mx-auto">
                    {children}
                </div>
            </section>
        </SidebarProvider>
    );
}
