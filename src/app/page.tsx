import { AppShell } from "@/src/components/common/app-shell";
import { DashboardSection } from "@/src/components/sections/dashboard-section";
import { PageHeader } from "@/src/components/sections/page-header";

export default function Home() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Admin dashboard"
        title="Company health, project progress, and team performance"
        description="A business-level operating view for admins to track delivery risk, resource allocation, and execution momentum."
      />
      <DashboardSection />
    </AppShell>
  );
}
