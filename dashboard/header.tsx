import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function DashboardHeader({ title, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        {children}
      </div>
    </div>
  );
}
