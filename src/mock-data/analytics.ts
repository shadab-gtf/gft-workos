import type { Activity, AnalyticsPoint, Stat } from "@/src/types";

export const dashboardStats: Stat[] = [
  { label: "Active Projects", value: "12", change: "+8% this month", tone: "primary" },
  { label: "Completion Rate", value: "84%", change: "+6% vs last cycle", tone: "success" },
  { label: "Delayed Tasks", value: "6", change: "-3 from last week", tone: "warning" },
  { label: "Team Productivity", value: "91", change: "+4 points", tone: "info" },
];

export const activity: Activity[] = [
  {
    id: "a-1",
    actorId: "u-manager-1",
    action: "moved",
    subject: "Project filters to review",
    timestamp: "2026-06-22T08:30:00.000Z",
  },
  {
    id: "a-2",
    actorId: "u-employee-2",
    action: "attached research to",
    subject: "Onboarding checklist",
    timestamp: "2026-06-21T16:15:00.000Z",
  },
  {
    id: "a-3",
    actorId: "u-admin-1",
    action: "approved",
    subject: "Quarterly reporting hub",
    timestamp: "2026-06-20T11:05:00.000Z",
  },
  {
    id: "a-4",
    actorId: "u-employee-6",
    action: "completed",
    subject: "Glassmorphism card variants",
    timestamp: "2026-06-20T09:42:00.000Z",
  },
  {
    id: "a-5",
    actorId: "u-manager-3",
    action: "created project",
    subject: "Dashboard Redesign",
    timestamp: "2026-06-19T14:30:00.000Z",
  },
  {
    id: "a-6",
    actorId: "u-employee-4",
    action: "started",
    subject: "Rate limiter implementation",
    timestamp: "2026-06-19T10:15:00.000Z",
  },
  {
    id: "a-7",
    actorId: "u-manager-4",
    action: "assigned",
    subject: "CI pipeline integration to backlog",
    timestamp: "2026-06-18T16:00:00.000Z",
  },
  {
    id: "a-8",
    actorId: "u-employee-7",
    action: "deployed",
    subject: "Alert notification system",
    timestamp: "2026-06-18T11:30:00.000Z",
  },
];

export const analytics: AnalyticsPoint[] = [
  { label: "Jan", completed: 42, delayed: 8, productivity: 74 },
  { label: "Feb", completed: 51, delayed: 7, productivity: 79 },
  { label: "Mar", completed: 48, delayed: 9, productivity: 76 },
  { label: "Apr", completed: 63, delayed: 6, productivity: 84 },
  { label: "May", completed: 68, delayed: 5, productivity: 88 },
  { label: "Jun", completed: 72, delayed: 4, productivity: 91 },
  { label: "Jul", completed: 58, delayed: 7, productivity: 82 },
  { label: "Aug", completed: 65, delayed: 5, productivity: 86 },
  { label: "Sep", completed: 71, delayed: 3, productivity: 90 },
  { label: "Oct", completed: 76, delayed: 4, productivity: 92 },
  { label: "Nov", completed: 69, delayed: 6, productivity: 87 },
  { label: "Dec", completed: 80, delayed: 3, productivity: 94 },
];
