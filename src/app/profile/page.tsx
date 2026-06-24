"use client";

import { AppShell } from "@/src/components/common/app-shell";
import { PageHeader } from "@/src/components/sections/page-header";
import { useAuthStore } from "@/src/store";
import {
  User as UserIcon,
  Personalcard,
  Briefcase,
  Buildings,
  ExportSquare,
  Sms,
  Call,
  Edit2
} from "iconsax-react";

export default function ProfilePage() {
  const { currentUser } = useAuthStore();

  if (!currentUser) return null;

  const profileItems = [
    { label: "Full Name", value: currentUser.name, icon: UserIcon },
    { label: "Employee ID", value: currentUser.id, icon: Personalcard },
    { label: "Designation", value: currentUser.title || currentUser.designation || "Not Set", icon: Briefcase },
    { label: "Department", value: currentUser.department || "Not Set", icon: Buildings },
    { label: "Official Email", value: currentUser.email, icon: Sms },
    { label: "Mobile Number", value: currentUser.mobileNumber || "Not Set", icon: Call },
    { label: "Reporting Manager", value: currentUser.reportingManager || "Not Set", icon: UserIcon },
    { label: "Role", value: currentUser.role.toUpperCase(), icon: ExportSquare },
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            eyebrow="My Profile"
            title="Employee Information"
            description="Manage your personal details, professional information, and security settings."
          />
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileItems.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <item.icon color="#2563eb" size={24} variant="Outline" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-base font-bold text-slate-900 mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Section */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ExportSquare size={20} className="text-primary-600" />
              Security Settings
            </h3>
            <p className="text-sm text-slate-500 mt-1">Manage your authentication preferences and account security.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Password</p>
                <p className="text-xs text-slate-500">Last changed 3 months ago</p>
              </div>
              <button className="text-sm font-bold text-primary-600 hover:text-primary-700">Change Password</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Biometric Authentication</p>
                <p className="text-xs text-slate-500">Use FaceID or Fingerprint to sign in quickly on this device.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2">
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
