import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    target?: string
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup className="flex flex-col">
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu className="gap-4">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.url.startsWith('http') ? (
              <SidebarMenuButton 
                onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-2 cursor-pointer"
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}