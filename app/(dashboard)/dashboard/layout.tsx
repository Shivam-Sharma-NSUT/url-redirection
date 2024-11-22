import AppSiderBar from '@/components/AppSideBar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from "@/components/ui/toaster"
import { cookies } from 'next/headers'
import React from 'react'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <>
      <SidebarProvider className='flex flex-row w-full' defaultOpen={defaultOpen}>
        <AppSiderBar />
        <SidebarTrigger />
        {children}
        <Toaster />
      </SidebarProvider>
    </>
  )
}

export default Layout