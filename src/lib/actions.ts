
'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';
import { accounts, insertAccountSchema, transactions, insertTransactionSchema, budgets, insertBudgetSchema, users, insertUserSchema } from './schema';
import { z } from 'zod';
import { and, eq, gte, lte } from 'drizzle-orm';


async function getUserId() {
    // This is a placeholder and will be replaced with real auth.
    // For now, we need a consistent ID for database queries.
    // In a real app, this would come from a verified session.
    return '123e4567-e89b-12d3-a456-426614174000';
}

// USER ACTIONS
export async function getUser(userId: string) {
    try {
        const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function addUser(userData: z.infer<typeof insertUserSchema>) {
    const validatedData = insertUserSchema.parse(userData);
    await db.insert(users).values(validatedData).onConflictDoNothing();
}

export async function updateUser(userId: string, userData: Partial<z.infer<typeof insertUserSchema>>) {
    await db.update(users).set(userData).where(eq(users.id, userId));
    revalidatePath('/settings');
}


// ACCOUNT ACTIONS
export async function getAccounts() {
  const userId = await getUserId();
  const data = await db.query.accounts.findMany({ where: eq(accounts.userId, userId)});
  return data;
}

export async function addAccount(formData: Omit<z.infer<typeof insertAccountSchema>, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const userId = await getUserId();
  const validatedData = insertAccountSchema.parse({
    ...formData,
    userId,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  });
  await db.insert(accounts).values(validatedData);
  revalidatePath('/accounts');
  revalidatePath('/');
}

// TRANSACTION ACTIONS
export async function getTransactions() {
    const userId = await getUserId();
    // This needs to be improved to get transactions for a specific user
    const data = await db.query.transactions.findMany();
    return data;
}

export async function getTransactionsForPeriod({ from, to }: { from: Date, to: Date }) {
    const userId = await getUserId();
     // This needs to be improved to get transactions for a specific user
    const data = await db.query.transactions.findMany({
        where: and(
            gte(transactions.date, from),
            lte(transactions.date, to)
        )
    });
    return data;
}

export async function addTransaction(formData: Omit<z.infer<typeof insertTransactionSchema>, 'id' | 'createdAt'>) {
    const validatedData = insertTransactionSchema.parse(formData);
    await db.insert(transactions).values(validatedData);
    revalidatePath('/');
    revalidatePath('/reports');
}

// BUDGET ACTIONS
export async function getBudgets() {
  const userId = await getUserId();
  const data = await db.query.budgets.findMany({ where: eq(budgets.userId, userId)});
  return data;
}

export async function addBudget(formData: Omit<z.infer<typeof insertBudgetSchema>, 'id' | 'userId' | 'spentAmount' | 'status' | 'createdAt' | 'updatedAt'>) {
  const userId = await getUserId();
  const validatedData = insertBudgetSchema.parse({
    ...formData,
    userId,
    id: undefined,
    spentAmount: '0',
    status: 'on track',
    createdAt: undefined,
    updatedAt: undefined
  });
  await db.insert(budgets).values(validatedData);
  revalidatePath('/budgets');
}
