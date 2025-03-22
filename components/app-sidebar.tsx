'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,

} from "@/components/ui/sidebar"

import Image from 'next/image'
import { usePathname, useRouter } from "next/navigation"
import HistoryButtons from "./SidebarComponents/HistoryButton"



export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleRedirect = () => {
    router.push('/')
  }

  const renderListItems = () => {
    if (pathname === '/dashboard') {
      return <></>
    } else if(pathname === '/onboard') {
      return (
        <></>
      )
    }else {
      return (
        <></>
      )
    }
  }

  return (
    <Sidebar color="white" className="z-50">
      <SidebarHeader>
        <SidebarMenu className="flex justify-between items-center w-full mt-4">
          <SidebarMenuItem className="">
            <div className='flex justify-between items-center w-full'>
              <Image
                src='/images/lawlogo.png'
                alt="Logo"
                width={140}
                height={140}
                onClick={handleRedirect}
                className="transition-opacity duration-300 cursor-pointer"
              />
              {/* <ThemeSwitcher /> */}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="custom-scrollbar ">
        <SidebarGroup>
          <SidebarGroupLabel>
          </SidebarGroupLabel>
          <SidebarGroupContent className="custom-scrollbar">

            {renderListItems()}
          </SidebarGroupContent>
        </SidebarGroup>
   
      </SidebarContent>
      <SidebarFooter>
     <HistoryButtons/>
        </SidebarFooter>
    </Sidebar>
  )
}