import { create } from "zustand";
import type { Task, TaskStatus } from "@/src/types";

interface TaskState {
  tasks: Map<string, Task>;
  tasksList: Task[];
  hydrate: (tasks: Task[]) => void;
  createTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  assignTask: (taskId: string, userId: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByAssignee: (assigneeId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getAllTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: new Map(),
  tasksList: [],

  hydrate: (tasks) =>
    set({ tasks: new Map(tasks.map((t) => [t.id, t])), tasksList: tasks }),

  createTask: (task) =>
    set((state) => {
      const next = new Map(state.tasks);
      next.set(task.id, task);
      return { tasks: next, tasksList: Array.from(next.values()) };
    }),

  updateTask: (id, updates) =>
    set((state) => {
      const existing = state.tasks.get(id);
      if (!existing) return state;
      const next = new Map(state.tasks);
      next.set(id, { ...existing, ...updates });
      return { tasks: next, tasksList: Array.from(next.values()) };
    }),

  deleteTask: (id) =>
    set((state) => {
      const next = new Map(state.tasks);
      next.delete(id);
      return { tasks: next, tasksList: Array.from(next.values()) };
    }),

  moveTask: (taskId, newStatus) =>
    set((state) => {
      const task = state.tasks.get(taskId);
      if (!task || task.status === newStatus) return state;
      const next = new Map(state.tasks);
      next.set(taskId, { ...task, status: newStatus });
      return { tasks: next, tasksList: Array.from(next.values()) };
    }),

  assignTask: (taskId, userId) =>
    set((state) => {
      const task = state.tasks.get(taskId);
      if (!task) return state;
      const next = new Map(state.tasks);
      next.set(taskId, { ...task, assigneeId: userId });
      return { tasks: next, tasksList: Array.from(next.values()) };
    }),

  getTaskById: (id) => get().tasks.get(id),

  getTasksByProject: (projectId) =>
    get().tasksList.filter((t) => t.projectId === projectId),

  getTasksByAssignee: (assigneeId) =>
    get().tasksList.filter((t) => t.assigneeId === assigneeId),

  getTasksByStatus: (status) =>
    get().tasksList.filter((t) => t.status === status),

  getAllTasks: () => get().tasksList,
}));
