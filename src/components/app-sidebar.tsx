"use client"

import { useAuth } from "@/hooks/useAuth"

import * as React from "react"
import {
  Utensils,
  ChartNoAxesCombined,
  HandPlatter,
  ScanBarcode,
  UserRound,
  ListOrdered,
  CircleDollarSign,
  Users,
  UtensilsCrossedIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuth()

  const data = {
    user: {
      name: auth.session?.user.name ?? "Nome do Usuário",
      email: auth.session?.user.email ?? "Email do Usuário",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Smart Order",
        logo: Utensils,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "https://smart-order-dashboard-pi.streamlit.app/",
        icon: ChartNoAxesCombined,
        target: "_blank"
      },
      {
        title: "Pesquisa de Satisfação",
        url: "/satisfaction",
        icon: UtensilsCrossedIcon,
      },
      {
        title: "Garçons",
        url: "/waiters",
        icon: HandPlatter,
      },
      {
        title: "Mesas",
        url: "/tables",
        icon: Utensils,
      },
      {
        title: "Produtos",
        url: "/products",
        icon: ScanBarcode,
      },
      {
        title: "Clientes",
        url: "/customers",
        icon: UserRound,
      },
      {
        title: "Pedidos",
        url: "/orders",
        icon: ListOrdered,
      },
      {
        title: "Pagamentos",
        url: "/payments",
        icon: CircleDollarSign,
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
