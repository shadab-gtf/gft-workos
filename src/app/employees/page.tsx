import { AppShell } from "@/src/components/common/app-shell";
import { PageHeader } from "@/src/components/sections/page-header";
import { EmployeesSection } from "@/src/components/sections/employees-section";

export default function EmployeesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Employee directory"
        title="Manage roles, utilization, and performance"
        description="Admins can track employee utilization to prevent burnout and review performance scores."
      />
      <EmployeesSection />
    </AppShell>
  );
}
