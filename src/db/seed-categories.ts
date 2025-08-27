import 'dotenv/config';
import { db } from './index';
import { categories, userCategories, NewCategory } from './schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const defaultCategories: Omit<NewCategory, 'createdAt' | 'updatedAt' | 'deletedAt'>[] = [
  { id: nanoid(), key: 'rent', label: 'Rent', icon: '🏠' },
  { id: nanoid(), key: 'groceries', label: 'Groceries', icon: '🛒' },
  { id: nanoid(), key: 'eat-out-takeaways', label: 'Eat Out & Takeaways', icon: '🍽️' },
  { id: nanoid(), key: 'transport-fuel', label: 'Transport & Fuel', icon: '🚗' },
  { id: nanoid(), key: 'medical', label: 'Medical', icon: '⚕️' },
  { id: nanoid(), key: 'personal-care', label: 'Personal Care', icon: '🧴' },
  { id: nanoid(), key: 'utilities', label: 'Utilities', icon: '💡' },
  { id: nanoid(), key: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { id: nanoid(), key: 'home-garden', label: 'Home & Garden', icon: '🏡' },
  { id: nanoid(), key: 'software-and-services', label: 'Software & Services', icon: '💻' },
  { id: nanoid(), key: 'pets', label: 'Pets', icon: '🐕' },
  { id: nanoid(), key: 'phone-internet', label: 'Phone & Internet', icon: '📱' },
  { id: nanoid(), key: 'savings', label: 'Savings', icon: '💰' },
  { id: nanoid(), key: 'investments', label: 'Investments', icon: '📈' },
  { id: nanoid(), key: 'housekeeping', label: 'Housekeeping', icon: '🧹' },
  { id: nanoid(), key: 'coffee', label: 'Coffee', icon: '☕' },
  { id: nanoid(), key: 'insurance', label: 'Insurance', icon: '🛡️' },
  { id: nanoid(), key: 'clothing', label: 'Clothing', icon: '👕' },
  { id: nanoid(), key: 'business', label: 'Business', icon: '💼' },
  { id: nanoid(), key: 'cash', label: 'Cash', icon: '💵' },
  { id: nanoid(), key: 'general-purchases', label: 'General Purchases', icon: '🛍️' },
  { id: nanoid(), key: 'parking', label: 'Parking', icon: '🅿️' },
  { id: nanoid(), key: 'books-stationary', label: 'Books & Stationary', icon: '📚' },
  { id: nanoid(), key: 'alcohol', label: 'Alcohol', icon: '🍺' },
  { id: nanoid(), key: 'bank-fees', label: 'Bank Fees', icon: '🏦' },
  { id: nanoid(), key: 'exception', label: 'Exception', icon: '⚠️' },
  { id: nanoid(), key: 'christmas-savings', label: 'Christmas Savings', icon: '🎄' },
  { id: nanoid(), key: 'travel-savings', label: 'Travel Savings', icon: '✈️' },
];

export const defaultUserCategories = [
  'groceries',
  'savings', 
  'entertainment',
  'medical',
  'general-purchases'
];

export async function seedCategories() {
  try {
    console.log('Starting category seed...');
    
    const now = new Date();
    
    for (const category of defaultCategories) {
      await db.insert(categories).values({
        ...category,
        createdAt: now,
        updatedAt: now,
      }).onConflictDoNothing();
    }
    
    console.log(`Seeded ${defaultCategories.length} categories successfully.`);
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
}

export async function seedUserCategories(userId: string) {
  try {
    console.log(`Starting user categories seed for user ${userId}...`);
    
    const now = new Date();
    
    for (const categoryKey of defaultUserCategories) {
      const [category] = await db.select().from(categories).where(eq(categories.key, categoryKey));
      
      if (category) {
        await db.insert(userCategories).values({
          id: nanoid(),
          userId,
          categoryId: category.id,
          createdAt: now,
          updatedAt: now,
        }).onConflictDoNothing();
      }
    }
    
    console.log(`Seeded ${defaultUserCategories.length} user categories successfully.`);
  } catch (error) {
    console.error('Error seeding user categories:', error);
    throw error;
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  seedCategories()
    .then(() => {
      console.log('Category seeding completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Category seeding failed:', error);
      process.exit(1);
    });
}