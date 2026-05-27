import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Gauge,
  FileText,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Rate Library", url: "/rate-library", icon: BookOpen },
  { title: "Productivity Library", url: "/productivity-library", icon: Gauge },
  { title: "All Quotes", url: "/quotes", icon: FileText },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Risk Register", url: "/risks", icon: ShieldAlert },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar({ user }: { user: User | null }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const email = user?.email ?? "";
  const initial = email.charAt(0).toUpperCase() || "?";

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed out");
    navigate({ to: "/login" });
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border">
      <SidebarHeader className="border-b border-border px-5 py-5">
        <Logo size="sm" />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.url || pathname.startsWith(item.url + "/");
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "relative h-10 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground border-l-2 border-primary rounded-l-none"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  <Link to={item.url} className="flex items-center gap-3 px-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-xs font-semibold text-white">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span
            className="min-w-0 flex-1 truncate text-sm text-foreground"
            title={email}
          >
            {email || "—"}
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
