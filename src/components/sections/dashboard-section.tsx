"use client";

import { ActivityTimeline } from "@/src/components/ui/activity-timeline";
import { AnalyticsChart } from "@/src/components/ui/analytics-chart";
import { Card, CardHeader } from "@/src/components/ui/card";
import { StatsGrid } from "@/src/components/ui/stats-grid";
import { ProjectList } from "@/src/components/ui/project-list";
import { KanbanBoard } from "@/src/components/ui/kanban-board";
import { useAuthStore, useProjectStore, useTeamStore, useEmployeeStore, useTaskStore } from "@/src/store";
import { activity, analytics, dashboardStats } from "@/src/mock-data/analytics";
import { EmptyState } from "@/src/components/ui/empty-state";

export function DashboardSection() {
  const { currentUser } = useAuthStore();
  const allProjects = useProjectStore((s) => s.getAllProjects());
  const allTeams = useTeamStore((s) => s.getAllTeams());
  const allUsers = useEmployeeStore((s) => s.getAllUsers());
  const allTasks = useTaskStore((s) => s.getAllTasks());

  if (!currentUser) return null;

  if (currentUser.role === "admin") {
    return (
      <div className="space-y-6">
        <StatsGrid stats={dashboardStats} />
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
          <Card>
            <CardHeader title="Company Analytics" />
            <div className="p-5">
              <AnalyticsChart data={analytics} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Recent Activity" />
            <ActivityTimeline activity={activity} users={allUsers} />
          </Card>
        </div>
        <Card>
          <CardHeader title="Project Health" />
          <ProjectList projects={allProjects} teams={allTeams} users={allUsers} />
        </Card>
      </div>
    );
  }

  if (currentUser.role === "manager") {
    const teamProjects = allProjects.filter((p) => p.teamId === currentUser.teamId);
    
    return (
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
          <Card>
            <CardHeader title="Team Delivery Trend" />
            <div className="p-5">
              <AnalyticsChart data={analytics.slice(6)} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Team Activity" />
            <ActivityTimeline activity={activity.slice(0, 4)} users={allUsers} />
          </Card>
        </div>
        <Card>
          <CardHeader title="Team Projects" />
          {teamProjects.length > 0 ? (
            <ProjectList projects={teamProjects} teams={allTeams} users={allUsers} />
          ) : (
            <EmptyState title="No active projects" message="Your team doesn't have any active projects right now." />
          )}
        </Card>
      </div>
    );
  }

  // Employee View
  const myTasks = allTasks.filter((t) => t.assigneeId === currentUser.id);
  const myProjects = allProjects.filter((p) => myTasks.some((t) => t.projectId === p.id));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="My Active Tasks" />
        <div className="p-5">
          {myTasks.length > 0 ? (
            <KanbanBoard tasks={myTasks} users={allUsers} />
          ) : (
            <EmptyState title="No tasks assigned" message="You don't have any active tasks on your board." />
          )}
        </div>
      </Card>
      <Card>
        <CardHeader title="Projects I'm Contributing To" />
        {myProjects.length > 0 ? (
          <ProjectList projects={myProjects} teams={allTeams} users={allUsers} />
        ) : (
          <EmptyState title="No active projects" message="You aren't contributing to any active projects right now." />
        )}
      </Card>
    </div>
  );
}
