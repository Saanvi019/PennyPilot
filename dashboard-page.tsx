
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowDownLeft,
  ArrowUpRight,
  LayoutDashboard,
  Wallet,
  Book,
  BarChart3,
  Settings,
  CircleDollarSign,
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
import SummaryCard from '@/components/dashboard/summary-card';
import { IncomeVsExpenseChart, ExpenseBreakdownChart } from '@/components/dashboard/charts';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import BudgetOverview from '@/components/dashboard/budget-overview';
import AddTransactionDialog from '@/components/dashboard/add-transaction-dialog';
import SpendingInsights from '@/components/dashboard/spending-insights';
import { categories } from '@/lib/data';
import type { Transaction, Account } from '@/lib/types';
import { getTransactions, getAccounts } from '@/lib/actions';
import UserNav from '@/components/user-nav';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    async function fetchData() {
      const transactionsData = await getTransactions();
      const accountsData = await getAccounts();
      setTransactions(transactionsData.map(t => ({...t, amount: parseFloat(t.amount as string), date: new Date(t.date).toISOString().split('T')[0]})));
      setAccounts(accountsData.map(a => ({...a, balance: parseFloat(a.balance as string)})));
    }
    fetchData();
  }, []);

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
                <SidebarMenuButton isActive>
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
          <DashboardHeader title="Dashboard">
            <AddTransactionDialog categories={categories} accounts={accounts} />
          </DashboardHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <SummaryCard
              title="Total Income"
              value="₹4,28,000"
              change="+10.2% this month"
              icon={<ArrowUpRight className="text-green-500" />}
            />
            <SummaryCard
              title="Total Expenses"
              value="₹1,69,640"
              change="+15.5% this month"
              icon={<ArrowDownLeft className="text-red-500" />}
            />
            <SummaryCard
              title="Current Balance"
              value="₹10,30,360"
              change={`Across ${accounts.length} accounts`}
              icon={<Wallet />}
            />
            <SummaryCard
              title="Savings Goal"
              value="₹2,00,000 / ₹8,00,000"
              change="Vacation Fund"
              icon={<CircleDollarSign />}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <IncomeVsExpenseChart />
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentTransactions transactions={transactions} />
            </div>
            <div className="lg:col-span-1">
              <ExpenseBreakdownChart />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
             <div className="lg:col-span-2">
                <SpendingInsights transactions={transactions} />
            </div>
            <div className="lg:col-span-1">
              <BudgetOverview />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
