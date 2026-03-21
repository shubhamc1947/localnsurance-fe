"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  CreditCard,
  MessageCircleQuestion,
  MessageSquare,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import NavLink from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Companies", url: "/admin/companies", icon: Building2 },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Quotes", url: "/admin/quotes", icon: FileText },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Support Tickets", url: "/admin/support", icon: MessageCircleQuestion },
  { title: "Contact Queries", url: "/admin/queries", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isActive = (path: string, end?: boolean) =>
    end ? pathname === path : pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-6 pb-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/admin")}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display font-bold text-lg">
              <span className="text-primary">Local</span>
              <span className="text-foreground">surance</span>
            </span>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground px-3 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                        isActive(item.url, item.end)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <Popover open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {user?.firstName?.charAt(0) ?? "A"}
                  {user?.lastName?.charAt(0) ?? ""}
                </span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.firstName ?? "Admin"} {user?.lastName ?? ""}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
              </div>
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-56 p-2">
            <button
              onClick={() => {
                logout();
                setProfileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Logout Account
            </button>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
}
