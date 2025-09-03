
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Wallet,
  Book,
  BarChart3,
  Settings,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";


import { Logo } from '@/components/logo';
import DashboardHeader from '@/components/dashboard/header';
import ProfileForm from '@/components/settings/profile-form';
import SecurityForm from '@/components/settings/security-form';
import PreferencesForm from '@/components/settings/preferences-form';
import UserNav from '@/components/user-nav';
import { useUser } from '@/context/user-context';
import { Skeleton } from '@/components/ui/skeleton';


export default function SettingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
           <Skeleton className="h-96 w-full" />
       </div>
   )
 }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton>
                  <LayoutDashboard />
                    Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/accounts">
                <SidebarMenuButton>
                    <Wallet />
                    Accounts
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/budgets">
                <SidebarMenuButton>
                  <Book />
                  Budgets
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/reports">
                <SidebarMenuButton>
                  <BarChart3 />
                  Reports
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/settings">
                <SidebarMenuButton isActive>
                  <Settings />
                  Settings
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="flex min-h-svh flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-background">
          <DashboardHeader title="Settings" />
           <Tabs defaultValue="profile" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <ProfileForm />
              </TabsContent>
              <TabsContent value="security">
                <SecurityForm />
              </TabsContent>
              <TabsContent value="preferences">
                <PreferencesForm />
              </TabsContent>
            </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
