import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <section className={`surface-card ${className}`}>
      {children}
    </section>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-6 py-5 divider-accent">
      <h2 className="text-lg font-semibold leading-[26px] text-slate-950">{title}</h2>
      {action}
    </div>
  );
}
