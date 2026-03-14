import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Grid3X3, Network, Users, CreditCard, MessageCircleQuestion, MoreHorizontal, ChevronDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import avatarImg from "@/assets/testimonial-avatar.jpg";

const insurancePlanItems = [
  { title: "Company Insurance Tree", url: "/dashboard/insurance-tree", icon: Network },
  { title: "Members Overview", url: "/dashboard/members", icon: Users },
  { title: "Bills & Payment", url: "/dashboard/bills", icon: CreditCard },
];

const otherItems = [
  { title: "Support", url: "/dashboard/support", icon: MessageCircleQuestion },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-6 pb-4">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-primary text-2xl font-bold">❤</span>
          <span className="font-display text-xl font-bold text-foreground">Local</span>
          <span className="font-display text-xl font-normal text-foreground">surance</span>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <img src="/placeholder.svg" alt="Company" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Your company</p>
            <p className="text-sm font-semibold text-foreground">Stealth Startup</p>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 h-10 bg-secondary/50 border-0 text-sm"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        {/* Company Insurance Plan Group */}
        <SidebarGroup>
          <button
            onClick={() => setPlanOpen(!planOpen)}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              "bg-primary/10 text-foreground"
            )}
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="flex-1 text-left">Company Insurance Plan</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", !planOpen && "-rotate-90")} />
          </button>

          {planOpen && (
            <SidebarGroupContent className="mt-1">
              <SidebarMenu>
                {insurancePlanItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive(item.url)
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
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
          )}
        </SidebarGroup>

        {/* Others Group */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs text-muted-foreground px-3">Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive(item.url)
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
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
              <img src={avatarImg} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">Amir Kerim</p>
                <p className="text-xs text-muted-foreground">amir@stealthstartup.com</p>
              </div>
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-56 p-2">
            <button
              onClick={() => { navigate("/dashboard/profile"); setProfileMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={() => { navigate("/login"); setProfileMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-destructive"
            >
              Logout Account
            </button>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
}
