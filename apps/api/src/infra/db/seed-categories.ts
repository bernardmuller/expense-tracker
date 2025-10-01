import 'dotenv/config';
import { db } from './index';
import { categories, userCategories, NewCategory } from './schema';
import { eq } from 'drizzle-orm';

export const defaultCategories: Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>[] = [
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