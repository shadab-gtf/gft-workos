"use client";

import { use } from "react";
import Link from "next/link";
import { useEmployeeStore, useTaskStore, useProjectStore } from "@/src/store";
import { AppShell } from "@/src/components/common/app-shell";
import { notFound } from "next/navigation";
import { ArrowLeft, Kanban, TaskSquare, Profile2User, TickSquare, InfoCircle } from "iconsax-react";
import { Badge, PriorityBadge, TaskStatusBadge } from "@/src/components/ui/badge";
import { formatDate, titleCase } from "@/src/lib/utils/format";
import { TeamsService } from "@/src/services/teams.service";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const unwrappedParams = use(params);
  const employeeId = unwrappedParams.employeeId;

  const employee = useEmployeeStore((s) => s.getUserById(employeeId));
  const allTasks = useTaskStore((s) => s.getAllTasks());
  const projects = useProjectStore((s) => s.getAllProjects());

  if (!employee) {
    notFound();
  }

  // Get tasks assigned to this employee
  const employeeTasks = allTasks.filter((t) => t.assigneeId === employee.id);

  // Get contribution report
  const report = TeamsService.getEmployeeContributionReport(employee);

  // Group tasks by status
  const pendingTasks = employeeTasks.filter((t) => t.status !== "completed");
  const completedTasks = employeeTasks.filter((t) => t.status === "completed");

  return (
    <AppShell>
      <div className="space-y-6 pt-4 pb-10">
        {/* Back Link and Page Header */}
        <div className="flex flex-col gap-2">
          <Link
            href="/teams"
            className="text-xs font-semibold text-slate-500 hover:text-primary-600 transition flex items-center gap-1.5 w-max cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Team Management
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 border-2 border-primary-200 shadow-sm">
                {employee.avatar}
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">{employee.name}</h1>
                <p className="text-sm text-slate-500 font-medium">
                  {employee.title} &bull; {employee.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge label={`Utilization: ${employee.utilization}%`} tone={employee.utilization > 85 ? "warning" : "primary"} />
              <Badge label={`Performance: ${employee.performance}%`} tone="success" />
            </div>
          </div>
        </div>

        {/* Overview Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <CardWrapper title="Active Tasks">
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{pendingTasks.length}</span>
              <span className="text-xs text-slate-400 font-semibold">ongoing</span>
            </div>
          </CardWrapper>
          <CardWrapper title="Completed Tasks">
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{completedTasks.length}</span>
              <span className="text-xs text-slate-400 font-semibold">tasks done</span>
            </div>
          </CardWrapper>
          <CardWrapper title="Total Assigned">
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{employeeTasks.length}</span>
              <span className="text-xs text-slate-400 font-semibold">total</span>
            </div>
          </CardWrapper>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left / Main Column: Task List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="surface-card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TaskSquare size={18} className="text-slate-400" />
                Assigned Task List
              </h3>

              {employeeTasks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center justify-center">
                  <InfoCircle size={24} className="text-slate-300 mb-2" />
                  <span>No tasks currently assigned to this employee.</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="py-3 pr-4">Task Details</th>
                        <th className="py-3 px-4 text-center">Priority</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 pl-4 text-right">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employeeTasks.map((task) => {
                        const project = projects.find((p) => p.id === task.projectId);
                        return (
                          <tr key={task.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3 pr-4 max-w-[240px] sm:max-w-xs">
                              <p className="font-bold text-slate-950 truncate leading-relaxed">{task.title}</p>
                              {project && (
                                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                                  Project: {project.name}
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <PriorityBadge priority={task.priority} />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <TaskStatusBadge status={task.status} />
                            </td>
                            <td className="py-3 pl-4 text-right text-slate-500 font-medium">
                              {formatDate(task.deadline)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contributions & Analytics */}
          <div className="space-y-4">
            {/* Contribution Details */}
            <div className="surface-card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TickSquare size={18} className="text-slate-400" />
                Contributions & Active Focus
              </h3>
              <ul className="space-y-3">
                {report.featuresAdded.map((feature, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <TickSquare size={15} className="text-emerald-500 shrink-0 mt-0.5" variant="Bold" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Performance Indicators */}
            <div className="surface-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Profile2User size={18} className="text-slate-400" />
                Execution Capacity
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Workload Utilization</span>
                    <span className="font-semibold text-slate-900">{employee.utilization}%</span>
                  </div>
                  <div className="h-2 rounded-sm bg-slate-100">
                    <div
                      className={`h-2 rounded-sm ${employee.utilization > 85 ? "bg-amber-500" : "bg-primary-600"}`}
                      style={{ width: `${employee.utilization}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Delivery Momentum</span>
                    <span className="font-semibold text-slate-900">{employee.performance}%</span>
                  </div>
                  <div className="h-2 rounded-sm bg-slate-100">
                    <div
                      className="h-2 rounded-sm bg-emerald-500"
                      style={{ width: `${employee.performance}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function CardWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-4 flex flex-col justify-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">{title}</p>
      {children}
    </div>
  );
}
