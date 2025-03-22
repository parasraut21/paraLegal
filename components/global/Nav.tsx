import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Nav() {
    return (
        <div className="w-full h-[4rem] backdrop-blur-3xl border-b flex justify-between items-center p-4">
            <div>HEADER</div>
            <div className="lg:hidden">
                <SidebarTrigger />
            </div>
        </div>
    )
}