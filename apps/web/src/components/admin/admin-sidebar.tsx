import { useState, memo, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Languages,
  BookOpen,
  GraduationCap,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Settings,
  BarChart3,
} from "lucide-react";

const navigation = [
  {
    name: "Languages",
    href: "/admin/languages",
    icon: Languages,
  },
  {
    name: "Units",
    href: "/admin/units",
    icon: BookOpen,
  },
  {
    name: "Lessons",
    href: "/admin/lessons",
    icon: GraduationCap,
  },
  {
    name: "Exercises",
    href: "/admin/exercises",
    icon: Dumbbell,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
] as const;

// Memoized navigation item component
const NavigationItem = memo(
  ({
    item,
    isActive,
    collapsed,
  }: {
    item: (typeof navigation)[number];
    isActive: boolean;
    collapsed: boolean;
  }) => {
    return (
      <Link key={item.name} href={item.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "px-2",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {!collapsed && <span className="ml-3">{item.name}</span>}
        </Button>
      </Link>
    );
  }
);

NavigationItem.displayName = "NavigationItem";

export const AdminSidebar = memo(() => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const navigationItems = useMemo(() => {
    return navigation.map((item) => {
      const isActive = pathname.includes(item.href);
      return (
        <NavigationItem
          key={item.name}
          item={item}
          isActive={isActive}
          collapsed={collapsed}
        />
      );
    });
  }, [pathname, collapsed]);

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-sidebar-foreground">
            Language Admin
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapsed}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">{navigationItems}</nav>
      </ScrollArea>
    </div>
  );
});

AdminSidebar.displayName = "AdminSidebar";
