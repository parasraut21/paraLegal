"use client"
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import path from "path";
import { use } from "react";

export default function Nav() {
    const pathname = usePathname()
    return (
        <div className="w-full h-[4rem] backdrop-blur-3xl border-b flex justify-between items-center p-4">
            <div className="lg:hidden">Para Legal</div>
            <div className=" hidden lg:block capitalize">{pathname.slice(1).split("-").join(" ")}</div>
            <div className="lg:hidden">
                <SidebarTrigger />
            </div>
        </div>
    )
}