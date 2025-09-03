
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from "@/components/ui/chart";
import { monthlyData, expenseData, categories } from "@/lib/data";

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

const expenseChartConfig = Object.fromEntries(
  categories.map((category, index) => [
    category,
    {
      label: category,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    },
  ])
) satisfies ChartConfig;

export function IncomeVsExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs. Expense</CardTitle>
        <CardDescription>For the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={monthlyChartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickFormatter={(value) => `₹${value / 1000}k`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
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


export function ExpenseBreakdownChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Current month's spending.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={expenseChartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                paddingAngle={5}
                labelLine={false}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={expenseChartConfig[entry.name]?.color} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" className="flex-wrap" />}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
