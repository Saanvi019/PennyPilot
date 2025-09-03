
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
import AddBudgetDialog from '@/components/budgets/add-budget-dialog';
import BudgetCard from '@/components/budgets/budget-card';
import { getBudgets, getAccounts } from '@/lib/actions';
import type { Budget, Account } from '@/lib/types';
import UserNav from '@/components/user-nav';
import { useUser } from '@/context/user-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
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
          const budgetsData = await getBudgets();
          const accountsData = await getAccounts();
          setBudgets(budgetsData.map(b => ({
            ...b,
            amount: parseFloat(b.amount as string),
            spentAmount: parseFloat(b.spentAmount as string),
          })));
          setAccounts(accountsData);
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
                <SidebarMenuButton>
                    <Wallet />
                    Accounts
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/budgets">
                <SidebarMenuButton isActive>
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
          <DashboardHeader title="Budgets">
            <AddBudgetDialog accounts={accounts} />
          </DashboardHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
             {budgets.length === 0 && (
                <p className="text-muted-foreground col-span-full">No budgets found. Create one to get started.</p>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
