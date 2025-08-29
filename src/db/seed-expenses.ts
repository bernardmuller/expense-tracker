import 'dotenv/config';
import { db } from './index';
import { expenses } from './schema';
import { readFileSync } from 'fs';
import { join } from 'path';

interface ExpenseData {
  idx: number;
  id: string;
  budget_id: string;
  description: string;
  amount: string;
  category: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export async function seedExpenses() {
  try {
    console.log('Starting expenses seed...');
    
    const expensesData: ExpenseData[] = JSON.parse(
      readFileSync('/home/bernard/Downloads/expenses_rows.json', 'utf-8')
    );
    
    console.log(`Found ${expensesData.length} expenses to seed`);
    
    for (const expense of expensesData) {
      await db.insert(expenses).values({
        budgetId: 2, // Set budget_id to 2 as requested
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        createdAt: new Date(expense.created_at),
        updatedAt: new Date(expense.updated_at),
      }).onConflictDoNothing();
    }
    
    console.log(`Seeded ${expensesData.length} expenses successfully.`);
  } catch (error) {
    console.error('Error seeding expenses:', error);
    throw error;
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  seedExpenses()
    .then(() => {
      console.log('Expense seeding completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Expense seeding failed:', error);
      process.exit(1);
    });
}