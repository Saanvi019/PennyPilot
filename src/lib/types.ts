
import { categories, accountTypes } from './data';
import type { selectBudgetSchema, selectUserSchema, selectAccountSchema } from './schema';
import type { z } from 'zod';

export type Category = (typeof categories)[number];

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: Category;
  accountId: string;
};

export type Budget = z.infer<typeof selectBudgetSchema>;

export type AccountType = (typeof accountTypes)[number];

export type Account = z.infer<typeof selectAccountSchema>;

export type User = z.infer<typeof selectUserSchema>;
