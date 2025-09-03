
"use client";

import { useUser } from '@/context/user-context';
import DashboardPage from '@/components/dashboard-page';
import LandingPage from '@/components/landing/landing-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <DashboardPage />;
}
