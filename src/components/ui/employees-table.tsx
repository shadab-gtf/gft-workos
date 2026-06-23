"use client";

import { Badge } from "@/src/components/ui/badge";
import { DataTable } from "@/src/components/ui/data-table";
import type { User } from "@/src/types";

export function EmployeesTable({ users }: { users: User[] }) {
  return (
    <DataTable
      data={users}
      searchPlaceholder="Search employees"
      columns={[
        { key: "name", label: "Employee" },
        { key: "role", label: "Role" },
        { key: "title", label: "Title" },
        { key: "utilization", label: "Utilization" },
        { key: "performance", label: "Performance" },
      ]}
      renderCell={(user, key) => {
        if (key === "role") return <Badge label={user.role} tone={user.role === "admin" ? "primary" : "muted"} />;
        if (key === "utilization" || key === "performance") return `${user[key]}%`;
        return user[key];
      }}
    />
  );
}
