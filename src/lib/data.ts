import type { Budget } from "./types";
import { subDays, format } from "date-fns";

export const categories = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Bills & Utilities",
  "Entertainment",
  "Health & Wellness",
  "Home",
  "Travel",
  "Salary",
  "Freelance",
] as const;

export const accountTypes = [
  "Checking",
  "Savings",
  "Wallet",
  "Credit Card",
  "Investment",
] as const;


export const budgets: Budget[] = [
  {
    category: "Food & Dining",
    limit: 500,
    spent: 310.45,
  },
  {
    category: "Shopping",
    limit: 400,
    spent: 250.99,
  },
  {
    category: "Transportation",
    limit: 200,
    spent: 180.1,
  },
  {
    category: "Entertainment",
    limit: 150,
    spent: 95.5,
  },
];

export const monthlyData = [
  { month: "Jan", income: 5000, expense: 2200 },
  { month: "Feb", income: 5100, expense: 2300 },
  { month: "Mar", income: 5200, expense: 2500 },
  { month: "Apr", income: 5050, expense: 2400 },
  { month: "May", income: 5300, expense: 2800 },
  { month: "Jun", income: 5350, expense: 2120 },
];

export const expenseData = [
  { name: "Food & Dining", value: 400 },
  { name: "Shopping", value: 300 },
  { name: "Transportation", value: 200 },
  { name: "Bills & Utilities", value: 278 },
  { name: "Entertainment", value: 189 },
];
