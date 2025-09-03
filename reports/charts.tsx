
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell, Legend, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip as ChartTooltipContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from "@/components/ui/chart";
import { categories } from "@/lib/data";
import type { Transaction } from "@/lib/types";
import { useMemo } from "react";

const formatCurrency = (value: number) => 
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

// --- Income/Expense Bar Chart ---
const monthlyChartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function IncomeExpenseBarChart({ data }: { data: Transaction[] }) {
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    data.forEach(tx => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        monthlyData[month].income += tx.amount;
      } else {
        monthlyData[month].expense += tx.amount;
      }
    });
    return Object.entries(monthlyData).map(([month, values]) => ({ month, ...values }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs. Expense</CardTitle>
        <CardDescription>A summary of your income and expenses over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={monthlyChartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltipContainer
                cursor={false}
                content={<ChartTooltipContent indicator="dot" formatter={(value) => formatCurrency(Number(value))} />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// --- Category Pie Chart ---
const expenseChartConfig = Object.fromEntries(
  categories.map((category, index) => [
    category,
    {
      label: category,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    },
  ])
) satisfies ChartConfig;

export function CategoryPieChart({ data }: { data: Transaction[] }) {
    const chartData = useMemo(() => {
        const categoryTotals: { [key: string]: number } = {};
        data.forEach(tx => {
            if (categoryTotals[tx.category]) {
                categoryTotals[tx.category] += tx.amount;
            } else {
                categoryTotals[tx.category] = tx.amount;
            }
        });
        return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>A breakdown of your expenses.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <ChartContainer config={expenseChartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltipContainer
                                cursor={false}
                                content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(Number(value))} />}
                            />
                             <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={60}
                                paddingAngle={5}
                                labelLine={false}
                                >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={expenseChartConfig[entry.name as keyof typeof expenseChartConfig]?.color || '#ccc'} />
                                ))}
                            </Pie>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="name" />}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
