
"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Wallet,
  Book,
  BarChart3,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote
} from 'lucide-react';
import { addDays } from "date-fns";
import type { DateRange } from "react-day-picker";

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
import { DateRangePicker } from "@/components/reports/date-range-picker";
import ReportSummaryCard from "@/components/reports/summary-card";
import { CategoryPieChart, IncomeExpenseBarChart } from "@/components/reports/charts";
import { getTransactionsForPeriod } from "@/lib/actions";
import type { Transaction } from "@/lib/types";
import UserNav from "@/components/user-nav";
import { useUser } from '@/context/user-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const { user, loading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  React.useEffect(() => {
    if (user && date?.from && date?.to) {
        async function fetchData() {
            const data = await getTransactionsForPeriod({ from: date.from!, to: date.to! });
            const formattedData = data.map(t => ({
              ...t,
              amount: parseFloat(t.amount as string)
            }));
            setTransactions(formattedData);
        }
        fetchData();
    }
  }, [date, user]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netSavings = totalIncome - totalExpenses;
  
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
                <SidebarMenuButton isActive>
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
          <DashboardHeader title="Reports">
            <DateRangePicker date={date} onDateChange={setDate} />
          </DashboardHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
             <ReportSummaryCard
              title="Total Income"
              value={totalIncome}
              icon={<ArrowUpRight className="text-green-500" />}
            />
            <ReportSummaryCard
              title="Total Expenses"
              value={totalExpenses}
              icon={<ArrowDownLeft className="text-red-500" />}
            />
            <ReportSummaryCard
              title="Net Savings"
              value={netSavings}
              icon={<Banknote className={netSavings >= 0 ? "text-green-500" : "text-red-500"}/>}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <IncomeExpenseBarChart data={transactions} />
            </div>
             <div className="lg:col-span-2">
              <CategoryPieChart data={transactions.filter(t => t.type === 'expense')} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
