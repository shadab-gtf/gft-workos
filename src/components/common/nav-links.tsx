"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart2,
  Element3,
  Kanban,
  People,
  Profile2User,
  Setting2,
  TaskSquare,
  CalendarTick,
  type Icon,
} from "iconsax-react";
import { usePermissions } from "@/src/hooks/use-permission";

const allNavItems: Array<{ href: string; label: string; icon: Icon; permission?: keyof ReturnType<typeof usePermissions> }> = [
  { href: "/", label: "Dashboard", icon: Element3 },
  { href: "/projects", label: "Projects", icon: TaskSquare },
  { href: "/tasks", label: "Tasks", icon: Kanban },
  { href: "/daily-report", label: "Daily Report", icon: CalendarTick, permission: "canCreateDailyReport" },
  { href: "/calendar", label: "Calendar", icon: CalendarTick },
  { href: "/teams", label: "Teams", icon: Profile2User },
  { href: "/employees", label: "Employees", icon: People, permission: "canManageEmployees" },
  { href: "/analytics", label: "Analytics", icon: Chart2, permission: "canViewCompanyAnalytics" },
  { href: "/settings", label: "Settings", icon: Setting2 },
];

export function NavLinks({ isCollapsed }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  const permissions = usePermissions();

  const navItems = allNavItems.filter((item) => {
    if (!item.permission) return true;
    return permissions[item.permission];
  });

  return (
    <nav className="mt-8 space-y-2" aria-label="Primary navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            title={isCollapsed ? item.label : undefined}
            className={`group relative flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 ${
              isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
            } ${active ? "text-white" : "text-slate-600 hover:text-primary-700"}`}
          >
            {active ? (
              <motion.div
                layoutId="sidebar-active-pill"
                className="absolute inset-0 rounded-full bg-primary-600 shadow-[var(--primary-cta-shadow)]"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            ) : (
              <div className="absolute inset-0 rounded-full bg-primary-100/70 opacity-0 transition-opacity group-hover:opacity-100" />
            )}

            <span className="relative z-10 flex shrink-0 items-center justify-center">
              <Icon size={24} color="currentColor" variant={active ? "Bold" : "Outline"} aria-hidden="true" />
            </span>

            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 overflow-hidden whitespace-nowrap text-sm font-medium leading-6"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </nav>
  );
}
