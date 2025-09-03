
import {
  pgTable,
  uuid,
  text,
  decimal,
  timestamp,
  pgEnum,
  boolean,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { accountTypes, categories } from './data';
import { z } from 'zod';

// Enums
export const accountTypeEnum = pgEnum('account_type', accountTypes);
export const transactionCategoryEnum = pgEnum('transaction_category', categories);
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const budgetStatusEnum = pgEnum('budget_status', ['on track', 'overspent', 'completed']);

// Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase UID
  fullName: text('full_name'),
  email: text('email').notNull(),
  avatar: text('avatar'),
  theme: text('theme').default('light'),
  currency: text('currency').default('INR'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
    fullName: z.string().optional().nullable(),
    avatar: z.string().optional().nullable(),
});
export const selectUserSchema = createSelectSchema(users);

// Accounts Table
export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  type: accountTypeEnum('type').notNull(),
  balance: decimal('balance', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts, {
    balance: z.string(),
});
export const selectAccountSchema = createSelectSchema(accounts);


// Transactions Table
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountId: uuid('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  category: transactionCategoryEnum('category').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions, {
    amount: z.string(),
    date: z.date(),
});
export const selectTransactionSchema = createSelectSchema(transactions);


// Budgets Table
export const budgets = pgTable('budgets', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    accountId: uuid('account_id').references(() => accounts.id),
    name: text('name'),
    category: transactionCategoryEnum('category').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    spentAmount: decimal('spent_amount', { precision: 12, scale: 2 }).default('0').notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    recurring: boolean('recurring').default(false).notNull(),
    alertThreshold: integer('alert_threshold'),
    status: budgetStatusEnum('status').default('on track').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertBudgetSchema = createInsertSchema(budgets, {
    amount: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    accountId: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    alertThreshold: z.number().optional().nullable(),
});
export const selectBudgetSchema = createSelectSchema(budgets);
