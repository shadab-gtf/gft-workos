"use client";

import { KanbanBoard } from "@/src/components/ui/kanban-board";
import { useAuthStore, useTaskStore, useEmployeeStore } from "@/src/store";
import { EmptyState } from "@/src/components/ui/empty-state";

export function TasksSection() {
  const { currentUser } = useAuthStore();
  const allTasks = useTaskStore((s) => s.getAllTasks());
  const allUsers = useEmployeeStore((s) => s.getAllUsers());
  
  if (!currentUser) return null;

  // Filter tasks based on role:
  // Admin/Manager: all tasks for projects they care about (for simplicity, we'll show all tasks for Admin, team tasks for Manager)
  // Employee: only assigned tasks
  let visibleTasks = allTasks;
  
  if (currentUser.role === "manager") {
    const teamMembers = allUsers.filter(u => u.teamId === currentUser.teamId).map(u => u.id);
    visibleTasks = allTasks.filter(t => teamMembers.includes(t.assigneeId));
  } else if (currentUser.role === "employee") {
    visibleTasks = allTasks.filter(t => t.assigneeId === currentUser.id);
  }

  if (visibleTasks.length === 0) {
    return <EmptyState title="No tasks found" message="There are no tasks available in your current view." />;
  }

  return <KanbanBoard tasks={visibleTasks} users={allUsers} />;
}
