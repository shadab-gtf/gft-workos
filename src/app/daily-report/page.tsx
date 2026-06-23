"use client";

import { useState } from "react";
import { AppShell } from "@/src/components/common/app-shell";
import { PageHeader } from "@/src/components/sections/page-header";
import { Button } from "@/src/components/ui/button";
import { useAuthStore, useDailyReportStore, useEmployeeStore, useProjectStore, useTaskStore, useTeamStore } from "@/src/store";
import { DailyReport, TaskLogEntry, MeetingCallEntry, EndOfDayNotes } from "@/src/types";
const uuidv4 = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// Step component prop types
interface TaskLogStepProps {
  taskLogs: TaskLogEntry[];
  onUpdate: (id: string, field: keyof TaskLogEntry, value: string) => void;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onNext: () => void;
  showMeetingsCalls: boolean;
}

const TaskLogStep = ({
  taskLogs,
  onUpdate,
  onAddTask,
  onDeleteTask,
  onNext,
  showMeetingsCalls,
}: TaskLogStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">Task Log</h3>
      {taskLogs.map((task: TaskLogEntry, index: number) => (
        <div key={task.id} className="p-4 border border-slate-200 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Task {index + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => onDeleteTask(task.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Task description</label>
              <input
                type="text"
                value={task.description}
                onChange={(e) => onUpdate(task.id, "description", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                value={task.category}
                onChange={(e) => onUpdate(task.id, "category", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Code Review">Code Review</option>
                <option value="Meeting">Meeting</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => onUpdate(task.id, "priority", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                value={task.status}
                onChange={(e) => onUpdate(task.id, "status", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Time spent</label>
              <input
                type="text"
                value={task.timeSpent}
                onChange={(e) => onUpdate(task.id, "timeSpent", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Expected date</label>
              <input
                type="date"
                value={task.expectedDate}
                onChange={(e) => onUpdate(task.id, "expectedDate", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Notes</label>
              <textarea
                value={task.notes}
                onChange={(e) => onUpdate(task.id, "notes", e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              ></textarea>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={onAddTask} className="w-full">
        + Add task row
      </Button>
      <div className="flex justify-end">
        <Button onClick={onNext}>
          Next: {showMeetingsCalls ? "Meetings & Calls" : "End of Day Notes"} &rarr;
        </Button>
      </div>
    </div>
  );
};

interface MeetingsCallsStepProps {
  meetingCalls: MeetingCallEntry[];
  onUpdate: (id: string, field: keyof MeetingCallEntry, value: string) => void;
  onAddMeetingCall: () => void;
  onDeleteMeetingCall: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  showMeetingsCalls: boolean;
}

const MeetingsCallsStep = ({
  meetingCalls,
  onUpdate,
  onAddMeetingCall,
  onDeleteMeetingCall,
  onBack,
  onNext,
  showMeetingsCalls,
}: MeetingsCallsStepProps) => {
  if (!showMeetingsCalls) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">Meetings & Calls</h3>
        <p className="text-slate-600">Meetings & Calls step is not applicable for your department.</p>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>&larr; Back</Button>
          <Button onClick={onNext}>Next: End of Day Notes &rarr;</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">Meetings & Calls</h3>
      {meetingCalls.map((mc: MeetingCallEntry, index: number) => (
        <div key={mc.id} className="p-4 border border-slate-200 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Meeting/Call {index + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => onDeleteMeetingCall(mc.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Subject</label>
              <input
                type="text"
                value={mc.subject}
                onChange={(e) => onUpdate(mc.id, "subject", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">With Whom</label>
              <input
                type="text"
                value={mc.withWhom}
                onChange={(e) => onUpdate(mc.id, "withWhom", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Time</label>
              <input
                type="text"
                value={mc.time}
                onChange={(e) => onUpdate(mc.id, "time", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Duration</label>
              <input
                type="text"
                value={mc.duration}
                onChange={(e) => onUpdate(mc.id, "duration", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Type</label>
              <select
                value={mc.type}
                onChange={(e) => onUpdate(mc.id, "type", e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              >
                <option value="meeting">Meeting</option>
                <option value="call">Call</option>
                <option value="review">Review</option>
                <option value="standup">Standup</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={onAddMeetingCall} className="w-full">
        + Add Meeting/Call
      </Button>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>&larr; Back</Button>
        <Button onClick={onNext}>Next: End of Day Notes &rarr;</Button>
      </div>
    </div>
  );
};

interface EndOfDayNotesStepProps {
  endOfDayNotes: EndOfDayNotes;
  onUpdate: (field: keyof EndOfDayNotes, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const EndOfDayNotesStep = ({
  endOfDayNotes,
  onUpdate,
  onBack,
  onNext,
}: EndOfDayNotesStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">End of Day Notes</h3>
      <div>
        <label className="block text-sm font-medium text-slate-700">What is pending?</label>
        <textarea
          value={endOfDayNotes.pending}
          onChange={(e) => onUpdate("pending", e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">What are the challenges?</label>
        <textarea
          value={endOfDayNotes.challenges}
          onChange={(e) => onUpdate("challenges", e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Plan for tomorrow</label>
        <textarea
          value={endOfDayNotes.planForTomorrow}
          onChange={(e) => onUpdate("planForTomorrow", e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>&larr; Back</Button>
        <Button onClick={onNext}>Next: Preview & Submit &rarr;</Button>
      </div>
    </div>
  );
};

interface PreviewSubmitStepProps {
  report: DailyReport;
  onBack: () => void;
  onSubmit: () => void;
}

const PreviewSubmitStep = ({
  report,
  onBack,
  onSubmit,
}: PreviewSubmitStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">Preview & Submit</h3>
      <div className="p-4 border border-slate-200 rounded-lg space-y-4">
        <h4 className="font-medium">Task Log</h4>
        {report.taskLogs.length > 0 ? (
          report.taskLogs.map((task: TaskLogEntry, index: number) => (
            <div key={task.id} className="border-b border-slate-100 pb-2 mb-2 last:border-b-0">
              <p className="text-sm font-medium">Task {index + 1}: {task.description}</p>
              <p className="text-xs text-slate-600">Category: {task.category}, Priority: {task.priority}, Status: {task.status}</p>
              <p className="text-xs text-slate-600">Time Spent: {task.timeSpent}, Expected Date: {task.expectedDate}</p>
              <p className="text-xs text-slate-600">Notes: {task.notes}</p>
            </div>
          ))
        ) : (<p className="text-sm text-slate-500">No tasks logged.</p>)}

        {report.meetingCalls && report.meetingCalls.length > 0 && (
          <>
            <h4 className="font-medium mt-4">Meetings & Calls</h4>
            {report.meetingCalls.map((mc: MeetingCallEntry, index: number) => (
              <div key={mc.id} className="border-b border-slate-100 pb-2 mb-2 last:border-b-0">
                <p className="text-sm font-medium">Meeting/Call {index + 1}: {mc.subject}</p>
                <p className="text-xs text-slate-600">With: {mc.withWhom}, Time: {mc.time}, Duration: {mc.duration}, Type: {mc.type}</p>
              </div>
            ))}
          </>
        )}

        <h4 className="font-medium mt-4">End of Day Notes</h4>
        <p className="text-sm text-slate-600">**Pending:** {report.endOfDayNotes.pending}</p>
        <p className="text-sm text-slate-600">**Challenges:** {report.endOfDayNotes.challenges}</p>
        <p className="text-sm text-slate-600">**Plan for Tomorrow:** {report.endOfDayNotes.planForTomorrow}</p>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>&larr; Back</Button>
        <Button onClick={onSubmit}>Preview & Submit</Button>
      </div>
    </div>
  );
};

export default function CreateDailyReportPage() {
  const { currentUser } = useAuthStore();
  const createReport = useDailyReportStore((state) => state.createReport);
  const allEmployees = useEmployeeStore((state) => state.getAllUsers());
  const allTeams = useTeamStore((state) => state.getAllTeams());

  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<DailyReport>({
    id: uuidv4(),
    employeeId: currentUser?.id || '',
    managerId: currentUser?.role === 'employee' ? allEmployees.find(emp => emp.id === currentUser?.id)?.createdBy || '' : currentUser?.id || '',
    date: new Date().toISOString().split('T')[0],
    taskLogs: [
      {
        id: uuidv4(),
        description: '',
        category: 'Other',
        priority: 'medium',
        status: 'in-progress',
        timeSpent: '0h 0m',
        expectedDate: new Date().toISOString().split('T')[0],
        notes: '',
      },
    ],
    meetingCalls: [],
    endOfDayNotes: {
      pending: '',
      challenges: '',
      planForTomorrow: '',
    },
    status: 'draft',
  });

  const employeeTeam = allTeams.find(team => team.memberIds.includes(currentUser?.id || ''));
  const showMeetingsCalls = employeeTeam?.type?.toLowerCase() === 'sales';

  const handleTaskLogUpdate = (id: string, field: keyof TaskLogEntry, value: string) => {
    setReportData((prev) => ({
      ...prev,
      taskLogs: prev.taskLogs.map((task) =>
        task.id === id ? { ...task, [field]: value } : task
      ),
    }));
  };

  const handleAddTask = () => {
    setReportData((prev) => ({
      ...prev,
      taskLogs: [
        ...prev.taskLogs,
        {
          id: uuidv4(),
          description: '',
          category: 'Other',
          priority: 'medium',
          status: 'in-progress',
          timeSpent: '0h 0m',
          expectedDate: new Date().toISOString().split('T')[0],
          notes: '',
        },
      ],
    }));
  };

  const handleDeleteTask = (id: string) => {
    setReportData((prev) => ({
      ...prev,
      taskLogs: prev.taskLogs.filter((task) => task.id !== id),
    }));
  };

  const handleMeetingCallUpdate = (id: string, field: keyof MeetingCallEntry, value: string) => {
    setReportData((prev) => ({
      ...prev,
      meetingCalls: prev.meetingCalls?.map((mc) =>
        mc.id === id ? { ...mc, [field]: value } : mc
      ),
    }));
  };

  const handleAddMeetingCall = () => {
    setReportData((prev) => ({
      ...prev,
      meetingCalls: [
        ...(prev.meetingCalls || []),
        {
          id: uuidv4(),
          subject: '',
          withWhom: '',
          time: '',
          duration: '',
          type: 'meeting',
        },
      ],
    }));
  };

  const handleDeleteMeetingCall = (id: string) => {
    setReportData((prev) => ({
      ...prev,
      meetingCalls: prev.meetingCalls?.filter((mc) => mc.id !== id),
    }));
  };

  const handleEndOfDayNotesUpdate = (field: keyof EndOfDayNotes, value: string) => {
    setReportData((prev) => ({
      ...prev,
      endOfDayNotes: {
        ...prev.endOfDayNotes,
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    createReport({ ...reportData, status: 'submitted' });
    alert('Daily Report Submitted!');
    // In a real app, you'd send this to a backend and then navigate away
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TaskLogStep
            taskLogs={reportData.taskLogs}
            onUpdate={handleTaskLogUpdate}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onNext={() => setCurrentStep(showMeetingsCalls ? 2 : 3)}
            showMeetingsCalls={showMeetingsCalls}
          />
        );
      case 2:
        return (
          <MeetingsCallsStep
            meetingCalls={reportData.meetingCalls || []}
            onUpdate={handleMeetingCallUpdate}
            onAddMeetingCall={handleAddMeetingCall}
            onDeleteMeetingCall={handleDeleteMeetingCall}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
            showMeetingsCalls={showMeetingsCalls}
          />
        );
      case 3:
        return (
          <EndOfDayNotesStep
            endOfDayNotes={reportData.endOfDayNotes}
            onUpdate={handleEndOfDayNotesUpdate}
            onBack={() => setCurrentStep(showMeetingsCalls ? 2 : 1)}
            onNext={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <PreviewSubmitStep
            report={reportData}
            onBack={() => setCurrentStep(3)}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Task Log";
      case 2: return "Meetings & Calls";
      case 3: return "End of Day Notes";
      case 4: return "Preview & Submit";
      default: return "";
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Daily Reporting"
        title="Create Daily Report"
        description="Log your daily tasks, meetings, and end-of-day notes."
      />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((step) => {
              if (!showMeetingsCalls && step === 2) return null; // Skip Meetings & Calls if not sales
              const actualStep = showMeetingsCalls ? step : (step > 2 ? step - 1 : step);
              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === step ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                  >
                    {actualStep}
                  </div>
                  <span className={`ml-2 text-sm ${currentStep === step ? 'font-semibold text-primary-600' : 'text-slate-500'}`}>
                    {getStepTitle(step)}
                  </span>
                  {step < 4 && <span className="ml-4 text-slate-300"> &rarr; </span>}
                </div>
              );
            })}
          </div>
          <Button onClick={handleSubmit} className="primary-cta">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            Preview & Submit
          </Button>
        </div>
        {renderStep()}
      </div>
    </AppShell>
  );
}
