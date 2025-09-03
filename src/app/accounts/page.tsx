
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

import { Logo } from '@/components/logo';
import DashboardHeader from '@/components/dashboard/header';
import AddAccountDialog from '@/components/accounts/add-account-dialog';
import AccountCard from '@/components/accounts/account-card';
import { getAccounts } from '@/lib/actions';
import type { Account } from '@/lib/types';
import UserNav from '@/components/user-nav';
import { useUser } from '@/context/user-context';
import { Skeleton } from '@/components/ui/skeleton';


export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { user, loading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  useEffect(() => {
    if (user) {
        async function fetchData() {
            const accountsData = await getAccounts();
            setAccounts(accountsData.map(a => ({
                ...a,
                balance: parseFloat(a.balance as string),
            })));
        }
        fetchData();
    }
  }, [user]);

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
                <SidebarMenuButton isActive>
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
                <SidebarMenuButton>
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
          <DashboardHeader title="Accounts">
            <AddAccountDialog />
          </DashboardHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
             {accounts.length === 0 && (
                <p className="text-muted-foreground col-span-full">No accounts found. Add one to get started.</p>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
