"use client";

import { useMemo, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageText1, Paperclip2 } from "iconsax-react";
import { PriorityBadge, TaskStatusBadge } from "@/src/components/ui/badge";
import { useAuthStore, useTaskStore } from "@/src/store";
import { formatDate, titleCase } from "@/src/lib/utils/format";
import type { Task, TaskStatus, User } from "@/src/types";

const columns: TaskStatus[] = ["backlog", "todo", "in-progress", "review", "completed"];

export function KanbanBoard({ tasks, users }: { tasks: Task[]; users: User[] }) {
  const [items, setItems] = useState(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const grouped = useMemo(
    () =>
      columns.map((status) => ({
        status,
        tasks: items.filter((task) => task.status === status),
      })),
    [items],
  );

  const activeTask = activeId ? items.find((t) => t.id === activeId) : undefined;

  const { currentUser } = useAuthStore();
  const updateTaskStatus = useTaskStore((s) => s.moveTask);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const taskId = String(event.active.id);
    const task = items.find((t) => t.id === taskId);
    if (currentUser?.role === "employee" && task?.assigneeId !== currentUser.id) {
      return;
    }
    setActiveId(taskId);
  }, [items, currentUser]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    setItems((current) => {
      const activeTask = current.find((t) => t.id === activeTaskId);
      if (!activeTask) return current;

      const isOverColumn = columns.includes(overId as TaskStatus);
      const overTask = current.find((t) => t.id === overId);

      let targetStatus: TaskStatus;
      if (isOverColumn) {
        targetStatus = overId as TaskStatus;
      } else if (overTask) {
        targetStatus = overTask.status;
      } else {
        return current;
      }

      if (activeTask.status === targetStatus) return current;

      return current.map((t) =>
        t.id === activeTaskId ? { ...t, status: targetStatus } : t,
      );
    });
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    let finalStatus: TaskStatus | null = null;

    setItems((current) => {
      const activeTask = current.find((t) => t.id === activeTaskId);
      if (!activeTask) return current;

      const isOverColumn = columns.includes(overId as TaskStatus);
      if (isOverColumn) {
        finalStatus = overId as TaskStatus;
        return current.map((t) =>
          t.id === activeTaskId ? { ...t, status: overId as TaskStatus } : t,
        );
      }

      const overTask = current.find((t) => t.id === overId);
      if (!overTask) return current;

      finalStatus = overTask.status;
      const statusTasks = current.filter((t) => t.status === finalStatus && t.id !== activeTaskId);
      const overIndex = statusTasks.findIndex((t) => t.id === overId);
      const updatedActive = { ...activeTask, status: finalStatus };

      const newStatusTasks = [...statusTasks];
      newStatusTasks.splice(overIndex, 0, updatedActive);

      const otherTasks = current.filter((t) => t.status !== finalStatus && t.id !== activeTaskId);
      return [...otherTasks, ...newStatusTasks];
    });

    if (finalStatus) {
      updateTaskStatus(activeTaskId, finalStatus);
    }
  }, [updateTaskStatus]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 overflow-x-auto pb-2 xl:grid-cols-5">
        {grouped.map((group) => (
          <KanbanColumn
            key={group.status}
            status={group.status}
            tasks={group.tasks}
            usersById={usersById}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCardOverlay task={activeTask} assignee={usersById.get(activeTask.assigneeId)} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({
  status,
  tasks,
  usersById,
}: {
  status: TaskStatus;
  tasks: Task[];
  usersById: Map<string, User>;
}) {
  return (
    <SortableContext id={status} items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
      <section className="surface-card min-w-72 overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3 divider-accent">
          <h2 className="text-sm font-semibold leading-6 text-slate-950">{titleCase(status)}</h2>
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold leading-5 text-primary-700">
            {tasks.length}
          </span>
        </div>
        <div className="space-y-3 p-3 min-h-[120px]">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} assignee={usersById.get(task.assigneeId)} />
          ))}
        </div>
      </section>
    </SortableContext>
  );
}

function TaskCard({ task, assignee }: { task: Task; assignee?: User }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-[var(--radius)] border border-primary-200/30 bg-white p-4 shadow-sm outline-none transition hover:shadow-md focus:ring-2 focus:ring-primary-500 active:cursor-grabbing"
    >
      <TaskCardContent task={task} assignee={assignee} />
    </article>
  );
}

function TaskCardOverlay({ task, assignee }: { task: Task; assignee?: User }) {
  return (
    <article className="cursor-grabbing rounded-[var(--radius)] border border-primary-300/40 bg-white p-4 shadow-lg ring-2 ring-primary-500/30">
      <TaskCardContent task={task} assignee={assignee} />
    </article>
  );
}

function TaskCardContent({ task, assignee }: { task: Task; assignee?: User }) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <TaskStatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>
      <h3 className="text-sm font-semibold leading-6 text-slate-950">{task.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-[11px] font-semibold leading-4 text-primary-700">
            {assignee?.avatar ?? "NA"}
          </span>
          <span className="text-xs leading-5 text-slate-500">{formatDate(task.deadline)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="inline-flex items-center gap-1 text-xs leading-5">
            <MessageText1 size={14} variant="Outline" aria-hidden="true" />
            {task.comments}
          </span>
          <span className="inline-flex items-center gap-1 text-xs leading-5">
            <Paperclip2 size={14} variant="Outline" aria-hidden="true" />
            {task.attachments}
          </span>
        </div>
      </div>
    </>
  );
}
