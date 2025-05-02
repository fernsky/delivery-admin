"use client";
import { Navbar } from "@/components/admin-panel/navbar";
import { ReactNode } from "react";

interface ContentLayoutProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContentLayout({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
}: ContentLayoutProps) {
  return (
    <div className={className}>
      <Navbar title={title} subtitle={subtitle} actions={actions} />
      <div className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="min-h-[calc(100vh-10rem)]">{children}</div>
      </div>
    </div>
  );
}
