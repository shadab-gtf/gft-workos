"use client";

import { useEmployeeStore } from "@/src/store";
import { formatDate } from "@/src/lib/utils/format";

// Mock activities since we don't have a dedicated activity store yet
const mockActivities = [
  {
    id: "1",
    userId: "u1", // Sarah (Admin)
    action: "created task",
    target: "Design system setup",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "2",
    userId: "u2", // Michael
    action: "moved task to In Progress",
    target: "Mobile App Beta testing",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "3",
    userId: "u3", // Emma
    action: "commented on",
    target: "API Integration for Tasks",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "4",
    userId: "u4", // James
    action: "attached a file to",
    target: "Performance Optimization",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

export function ProjectActivityTab({ projectId }: { projectId: string }) {
  const users = useEmployeeStore((s) => s.usersList);
  
  const getUser = (id: string) => users.find(u => u.id === id);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
      
      <div className="relative border-l border-slate-200 ml-4 pl-6 flex flex-col gap-8">
        {mockActivities.map((activity) => {
          const user = getUser(activity.userId);
          
          return (
            <div key={activity.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-primary-500">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {user ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700">
                      {user.avatar}
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                      NA
                    </div>
                  )}
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{user?.name || "Unknown User"}</span>
                    {" "}
                    {activity.action}
                    {" "}
                    <span className="font-medium text-slate-900">{activity.target}</span>
                  </p>
                </div>
                <span className="text-xs text-slate-500 ml-8">
                  {formatDate(activity.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
