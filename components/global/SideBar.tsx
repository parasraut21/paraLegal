import {
  BookOpen,
  Brain,
  HeartHandshake,
  Home,
  MessageSquareText,
  Languages,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { auth, signOut } from "@/lib/auth";
import { Button } from "../ui/button";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  // {
  //   title: "Ai Chat",
  //   url: "/ai-chat",
  //   icon: Brain,
  // },
  {
    title: "Learnings",
    url: "/learn",
    icon: BookOpen,
  },
  {
    title: "Threads",
    url: "/threads",
    icon: MessageSquareText,
  },
  {
    title: "Emotional Support",
    url: "/ai-support",
    icon: HeartHandshake,
  },
  {
    title: "Multilingual",
    url: "/multilingual",
    icon: Languages,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Home,
  },
];

export async function SidebarMain() {
  const session = await auth();
  return (
    <Sidebar
      variant="sidebar"
      className="min-h-screen bg-[#050508] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#0a0a15] via-[#050508] to-[#030305] bg-fixed"
    >
      <SidebarContent className="p-4">
        <SidebarGroup className="h-full bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <SidebarHeader className="px-6 py-4">
            <h1 className="text-3xl font-bold text-primary">Para Legal</h1>
          </SidebarHeader>
          <SidebarGroupContent className="pt-6 px-6">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="text-gray-100">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarFooter className="mt-auto px-6 py-4 border-t border-primary/20 ">
            {session ? (
              <div className="space-y-2 flex items-baseline gap-4">
                <p className="text-right text-gray-200">{session?.user?.name?.split(" ")[0]}</p>
                <form
                  className="flex items-center "
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button type="submit" className="bg-primary hover:bg-primary/80 transition-colors rounded-full" variant="destructive">
                    Sign Out
                  </Button>
                </form>
              </div>
            ) : null}
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
