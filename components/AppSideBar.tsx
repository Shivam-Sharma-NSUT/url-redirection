import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from './ui/sidebar'
import { Home, Settings } from "lucide-react"


const items = [
    {
      title: "Home",
      url: "/dashboard/",
      icon: Home,
    },
    {
      title: "Setting",
      url: "/dashboard/setting",
      icon: Settings,
    },
  ]
  

const AppSiderBar = () => {
  return (
    <Sidebar variant='floating' collapsible='icon'>
        <SidebarHeader>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map(item => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
        <SidebarRail />
    </Sidebar>
  )
}

export default AppSiderBar