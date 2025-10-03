import 'dotenv/config';
import { db } from './index.js';
import {
  categories,
  users,
  accounts,
  userCategories,
  budgets,
  categoryBudgets,
  expenses,
  NewCategory,
  NewBudget,
  NewCategoryBudget,
  NewExpense,
} from './schema.js';

const categoriesData: Omit<
  NewCategory,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  { key: 'rent', label: 'Rent', icon: '🏠' },
  { key: 'groceries', label: 'Groceries', icon: '🛒' },
  { key: 'eat-out-takeaways', label: 'Eat Out & Takeaways', icon: '🍽️' },
  { key: 'transport-fuel', label: 'Transport & Fuel', icon: '🚗' },
  { key: 'medical', label: 'Medical', icon: '⚕️' },
  { key: 'personal-care', label: 'Personal Care', icon: '🧴' },
  { key: 'utilities', label: 'Utilities', icon: '💡' },
  { key: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { key: 'home-garden', label: 'Home & Garden', icon: '🏡' },
  { key: 'software-and-services', label: 'Software & Services', icon: '💻' },
  { key: 'pets', label: 'Pets', icon: '🐕' },
  { key: 'phone-internet', label: 'Phone & Internet', icon: '📱' },
  { key: 'savings', label: 'Savings', icon: '💰' },
  { key: 'investments', label: 'Investments', icon: '📈' },
  { key: 'housekeeping', label: 'Housekeeping', icon: '🧹' },
  { key: 'coffee', label: 'Coffee', icon: '☕' },
  { key: 'insurance', label: 'Insurance', icon: '🛡️' },
  { key: 'clothing', label: 'Clothing', icon: '👕' },
  { key: 'business', label: 'Business', icon: '💼' },
  { key: 'cash', label: 'Cash', icon: '💵' },
  { key: 'general-purchases', label: 'General Purchases', icon: '🛍️' },
  { key: 'parking', label: 'Parking', icon: '🅿️' },
  { key: 'books-stationary', label: 'Books & Stationary', icon: '📚' },
  { key: 'alcohol', label: 'Alcohol', icon: '🍺' },
  { key: 'bank-fees', label: 'Bank Fees', icon: '🏦' },
  { key: 'exception', label: 'Exception', icon: '⚠️' },
  { key: 'christmas-savings', label: 'Christmas Savings', icon: '🎄' },
  { key: 'travel-savings', label: 'Travel Savings', icon: '✈️' },
  { key: 'gifts', label: 'Gifts', icon: '🎁' },
];

const budgetsData: Omit<
  NewBudget,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  {
    userId: 'h6yJqmzqgaZOLKJqC7R1gJrWGIq54gq5',
    name: 'Budget - 23 Sep 2025',
    startAmount: '20000.00',
    currentAmount: '3700.00',
    isActive: true,
  },
];

const categoryBudgetsData: Omit<
  NewCategoryBudget,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  {
    budgetId: 1,
    categoryId: 1,
    allocatedAmount: '10000.00',
  },
  {
    budgetId: 1,
    categoryId: 2,
    allocatedAmount: '4000.00',
  },
  {
    budgetId: 1,
    categoryId: 3,
    allocatedAmount: '1000.00',
  },
  {
    budgetId: 1,
    categoryId: 8,
    allocatedAmount: '1000.00',
  },
  {
    budgetId: 1,
    categoryId: 13,
    allocatedAmount: '4000.00',
  },
];

const expensesData: Omit<
  NewExpense,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  {
    budgetId: 1,
    description: 'Rent',
    amount: '10000.00',
    category: 'rent',
  },
  {
    budgetId: 1,
    description: 'Entertainment',
    amount: '200.00',
    category: 'entertainment',
  },
  {
    budgetId: 1,
    description: 'Eat-out-takeaways',
    amount: '250.00',
    category: 'eat-out-takeaways',
  },
  {
    budgetId: 1,
    description: 'Groceries',
    amount: '1250.00',
    category: 'groceries',
  },
  {
    budgetId: 1,
    description: 'Entertainment',
    amount: '600.00',
    category: 'entertainment',
  },
  {
    budgetId: 1,
    description: 'Savings',
    amount: '1000.00',
    category: 'savings',
  },
  {
    budgetId: 1,
    description: 'Investments',
    amount: '2000.00',
    category: 'savings',
  },
  {
    budgetId: 1,
    description: 'Vacation',
    amount: '1000.00',
    category: 'savings',
  },
];

const userData = {
  id: 'h6yJqmzqgaZOLKJqC7R1gJrWGIq54gq5',
  name: 'Bernard',
  email: 'me@bernardmuller.co.za',
  emailVerified: false,
  image: null,
  createdAt: new Date('2025-09-23 21:24:05.307'),
  updatedAt: new Date('2025-09-23 21:24:05.307'),
};

const accountData = {
  id: 'UGY9O4rBgsRHNCozdTYv2QbFonkkSn7w',
  accountId: 'h6yJqmzqgaZOLKJqC7R1gJrWGIq54gq5',
  providerId: 'credential',
  userId: 'h6yJqmzqgaZOLKJqC7R1gJrWGIq54gq5',
  accessToken: null,
  refreshToken: null,
  idToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  scope: null,
  password:
    '97e1fe8d5e6d11f56c29ce3c9ca659ed:119dd77d8a419319a40363c499bd4e8bfc02fa9f72b860d6ed06f1bfbb89c7cc69874483f0fa780b716585895127bee35fef525c120465b4568c3e2abc0b97a5',
  createdAt: new Date('2025-09-23 21:24:05.312'),
  updatedAt: new Date('2025-09-23 21:24:05.312'),
};

const userCategoriesData = [
  {
    userId: 'h6yJqmzqgaZOLKJqC7R1gJrWGIq54gq5',
    categoryId: 1,
    createdAt: new Date('2025-09-23 21:38:02.001'),
    updatedAt: new Date('2025-09-23 21:38:02.001'),
  },
  {
    userId: 'h6yJqmzqgaZOLKJqC7R1gJrWGIq54gq5',
    categoryId: 2,
    createdAt: new Date('2025-09-23 21:38:02.572'),
    updatedAt: new Date('2025-09-23 21:38:02.572'),
  },
  {
    userId: 'h6yJqmzqgaZOLKJqC7R1gJrWGIq54gq5',
    categoryId: 3,
    createdAt: new Date('2025-09-23 21:38:03.313'),
    updatedAt: new Date('2025-09-23 21:38:03.313'),
  },
  {
    userId: 'h6yJqmzqgaZOLKJqC7R1gJrWGIq54gq5',
    categoryId: 8,
    createdAt: new Date('2025-09-23 21:38:05.84'),
    updatedAt: new Date('2025-09-23 21:38:05.84'),
  },
  {
    userId: 'h6yJqmzqgaZOLKJqC7R1gJrWGIq54gq5',
    categoryId: 13,
    createdAt: new Date('2025-09-23 21:38:07.783'),
    updatedAt: new Date('2025-09-23 21:38:07.783'),
  },
];

export async function seedDatabase() {
  try {
    for (const category of categoriesData) {
      await db
        .insert(categories)
        .values({
          ...category,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();
    }

    await db.insert(users).values(userData).onConflictDoNothing();
    await db.insert(accounts).values(accountData).onConflictDoNothing();

    for (const userCategory of userCategoriesData) {
      await db
        .insert(userCategories)
        .values(userCategory)
        .onConflictDoNothing();
    }

    for (const budget of budgetsData) {
      await db
        .insert(budgets)
        .values({
          ...budget,
          createdAt: new Date('2025-09-23 21:42:47.023'),
          updatedAt: new Date('2025-09-23 21:44:45.153'),
        })
        .onConflictDoNothing();
    }

    for (const categoryBudget of categoryBudgetsData) {
      await db
        .insert(categoryBudgets)
        .values({
          ...categoryBudget,
          createdAt: new Date('2025-09-23 21:42:47.024'),
          updatedAt: new Date('2025-09-23 21:42:47.024'),
        })
        .onConflictDoNothing();
    }

    for (const expense of expensesData) {
      await db
        .insert(expenses)
        .values({
          ...expense,
          createdAt: new Date(
            expense.description === 'Rent'
              ? '2025-09-23 21:43:32.306'
              : expense.description === 'Entertainment' &&
                  expense.amount === '200.00'
                ? '2025-09-23 21:43:40.633'
                : expense.description === 'Eat-out-takeaways'
                  ? '2025-09-23 21:43:45.649'
                  : expense.description === 'Groceries'
                    ? '2025-09-23 21:43:52.687'
                    : expense.description === 'Entertainment' &&
                        expense.amount === '600.00'
                      ? '2025-09-23 21:44:01.429'
                      : expense.description === 'Savings'
                        ? '2025-09-23 21:44:24.679'
                        : expense.description === 'Investments'
                          ? '2025-09-23 21:44:35.256'
                          : '2025-09-23 21:44:45.152'
          ),
          updatedAt: new Date(
            expense.description === 'Rent'
              ? '2025-09-23 21:43:32.306'
              : expense.description === 'Entertainment' &&
                  expense.amount === '200.00'
                ? '2025-09-23 21:43:40.633'
                : expense.description === 'Eat-out-takeaways'
                  ? '2025-09-23 21:43:45.649'
                  : expense.description === 'Groceries'
                    ? '2025-09-23 21:43:52.687'
                    : expense.description === 'Entertainment' &&
                        expense.amount === '600.00'
                      ? '2025-09-23 21:44:01.429'
                      : expense.description === 'Savings'
                        ? '2025-09-23 21:44:24.679'
                        : expense.description === 'Investments'
                          ? '2025-09-23 21:44:35.256'
                          : '2025-09-23 21:44:45.152'
          ),
        })
        .onConflictDoNothing();
    }

    console.table([
      {
        Entity: 'Categories',
        Count: categoriesData.length,
        Status: '✓ Seeded',
      },
      { Entity: 'Users', Count: 1, Status: '✓ Seeded' },
      { Entity: 'Accounts', Count: 1, Status: '✓ Seeded' },
      {
        Entity: 'User Categories',
        Count: userCategoriesData.length,
        Status: '✓ Seeded',
      },
      { Entity: 'Budgets', Count: budgetsData.length, Status: '✓ Seeded' },
      {
        Entity: 'Category Budgets',
        Count: categoryBudgetsData.length,
        Status: '✓ Seeded',
      },
      { Entity: 'Expenses', Count: expensesData.length, Status: '✓ Seeded' },
    ]);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  seedDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}
