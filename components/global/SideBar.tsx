import { BookOpen, Brain, HeartHandshake, Home, MessageSquareText } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { auth, signOut } from "@/lib/auth"
import { Button } from "../ui/button"
import Link from "next/link"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Ai Chat",
        url: "/ai-chat",
        icon: Brain,
    },
    {
        title: "learnings",
        url: "/learn",
        icon: BookOpen,
    },
    {
        title: "Threads",
        url: "/threads",
        icon: MessageSquareText,
    },
    {
        title: "Ai Support",
        url: "/ai-support",
        icon: HeartHandshake,
    },
]

export async function SidebarMain() {
    const session = await auth()
    return (
        <Sidebar variant="sidebar">
            <SidebarContent>
                <SidebarGroup className="h-full">
                    <SidebarHeader>
                        <h1 className="text-3xl font-bold text-teal">Para Learn</h1>
                    </SidebarHeader>
                    <SidebarGroupContent className="pt-6">
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarFooter className="mt-auto">
                        {session ? (
                            <div className="space-y-2">
                                <p className="text-right">{session.user.name}</p>
                                <form className="flex items-center justify-end" action={async () => {
                                    "use server"
                                    await signOut();
                                }}>
                                    <Button type="submit" variant={"destructive"}>Sign Out</Button>
                                </form>
                            </div>
                        ) : null}
                    </SidebarFooter>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
