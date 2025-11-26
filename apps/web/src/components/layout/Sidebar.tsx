"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Ship,
  FileSignature,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Crew", href: "/crew", icon: Users },
  {
    name: "Certificates",
    href: "/certificates",
    icon: FileText,
    children: [
      { name: "All Certificates", href: "/certificates", icon: FileText },
      { name: "Expiring", href: "/certificates/expiring", icon: AlertTriangle },
      { name: "Add Certificate", href: "/certificates/add", icon: Plus },
    ],
  },
  { name: "Vessels", href: "/vessels", icon: Ship },
  { name: "Contracts", href: "/contracts", icon: FileSignature },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    // Auto-expand items that have active children
    const expanded: string[] = [];
    navigation.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => pathname === child.href || pathname?.startsWith(child.href + "/")
        );
        if (hasActiveChild) {
          expanded.push(item.name);
        }
      }
    });
    return expanded;
  });

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive =
      item.href &&
      (pathname === item.href || pathname?.startsWith(item.href + "/"));
    const expanded = hasChildren ? isExpanded(item.name) : false;

    return (
      <div key={item.name}>
        {hasChildren ? (
          <>
            <div className="flex items-center">
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-1 items-center gap-3 rounded-l-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  style={{ paddingLeft: `${12 + level * 16}px` }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ) : (
                <div
                  className={cn(
                    "flex flex-1 items-center gap-3 rounded-l-lg px-3 py-2 text-sm font-medium",
                    "text-muted-foreground"
                  )}
                  style={{ paddingLeft: `${12 + level * 16}px` }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleExpanded(item.name);
                }}
                className={cn(
                  "flex items-center justify-center rounded-r-lg px-2 py-2 transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
            {expanded && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children!.map((child) => {
                  const childIsActive =
                    pathname === child.href ||
                    pathname?.startsWith(child.href + "/");
                  return (
                    <Link
                      key={child.name}
                      href={child.href!}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        childIsActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      style={{ paddingLeft: `${12 + (level + 1) * 16}px` }}
                    >
                      <child.icon className="h-4 w-4" />
                      {child.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <Link
            href={item.href!}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary">Maritime Crew</h1>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => renderNavItem(item))}
      </nav>
    </div>
  );
}
