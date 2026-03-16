import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Search,
  Settings,
  Shield } from
"lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar } from
"@/components/ui/sidebar";

const menuItems = [
{ title: "Dashboard", url: "/", icon: LayoutDashboard },
{ title: "Atendimentos", url: "/atendimentos", icon: FileText },
{ title: "Novo Atendimento", url: "/novo-atendimento", icon: PlusCircle },
{ title: "Buscar Protocolo", url: "/buscar", icon: Search }];


export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#01234c]">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed &&
          <div className="animate-fade-in">
              <h1 className="text-sm font-bold tracking-wide text-sidebar-accent-foreground">
                AGRM
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/60">
                Ouvidoria
              </p>
            </div>
          }
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
              <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  tooltip={item.title}>
                  
                    <NavLink
                    to={item.url}
                    end
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                    
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
            <Settings className="h-4 w-4 text-sidebar-foreground" />
          </div>
          {!collapsed &&
          <div className="animate-fade-in">
              <p className="text-xs font-medium text-sidebar-accent-foreground">
                Administrador
              </p>
              <p className="text-[10px] text-sidebar-foreground/50">
                admin@agrm.gov.br
              </p>
            </div>
          }
        </div>
      </SidebarFooter>
    </Sidebar>);

}