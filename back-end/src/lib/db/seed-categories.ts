import "dotenv/config";
import { db } from "./index";
import { categories, userCategories, type NewCategory } from "./schema";
import { eq } from "drizzle-orm";
import { generateUuid } from "@/lib/utils/generateUuid";

// Generate category IDs - call this function to get a consistent set of UUIDs
export function generateCategoryIds() {
  return {
    rent: generateUuid(),
    groceries: generateUuid(),
    "eat-out-takeaways": generateUuid(),
    "transport-fuel": generateUuid(),
    medical: generateUuid(),
    "personal-care": generateUuid(),
    utilities: generateUuid(),
    entertainment: generateUuid(),
    "home-garden": generateUuid(),
    "software-and-services": generateUuid(),
    pets: generateUuid(),
    "phone-internet": generateUuid(),
    savings: generateUuid(),
    investments: generateUuid(),
    housekeeping: generateUuid(),
    coffee: generateUuid(),
    insurance: generateUuid(),
    clothing: generateUuid(),
    business: generateUuid(),
    cash: generateUuid(),
    "general-purchases": generateUuid(),
    parking: generateUuid(),
    "books-stationary": generateUuid(),
    alcohol: generateUuid(),
    "bank-fees": generateUuid(),
    exception: generateUuid(),
    "christmas-savings": generateUuid(),
    "travel-savings": generateUuid(),
  } as const;
}

export type CategoryIds = ReturnType<typeof generateCategoryIds>;

// Generate default categories with the provided category IDs
export function generateDefaultCategories(
  categoryIds: CategoryIds,
): Array<Omit<NewCategory, "createdAt" | "updatedAt" | "deletedAt">> {
  return [
    { id: categoryIds["rent"], key: "rent", label: "Rent", icon: "🏠" },
    {
      id: categoryIds["groceries"],
      key: "groceries",
      label: "Groceries",
      icon: "🛒",
    },
    {
      id: categoryIds["eat-out-takeaways"],
      key: "eat-out-takeaways",
      label: "Eat Out & Takeaways",
      icon: "🍽️",
    },
    {
      id: categoryIds["transport-fuel"],
      key: "transport-fuel",
      label: "Transport & Fuel",
      icon: "🚗",
    },
    {
      id: categoryIds["medical"],
      key: "medical",
      label: "Medical",
      icon: "⚕️",
    },
    {
      id: categoryIds["personal-care"],
      key: "personal-care",
      label: "Personal Care",
      icon: "🧴",
    },
    {
      id: categoryIds["utilities"],
      key: "utilities",
      label: "Utilities",
      icon: "💡",
    },
    {
      id: categoryIds["entertainment"],
      key: "entertainment",
      label: "Entertainment",
      icon: "🎮",
    },
    {
      id: categoryIds["home-garden"],
      key: "home-garden",
      label: "Home & Garden",
      icon: "🏡",
    },
    {
      id: categoryIds["software-and-services"],
      key: "software-and-services",
      label: "Software & Services",
      icon: "💻",
    },
    { id: categoryIds["pets"], key: "pets", label: "Pets", icon: "🐕" },
    {
      id: categoryIds["phone-internet"],
      key: "phone-internet",
      label: "Phone & Internet",
      icon: "📱",
    },
    {
      id: categoryIds["savings"],
      key: "savings",
      label: "Savings",
      icon: "💰",
    },
    {
      id: categoryIds["investments"],
      key: "investments",
      label: "Investments",
      icon: "📈",
    },
    {
      id: categoryIds["housekeeping"],
      key: "housekeeping",
      label: "Housekeeping",
      icon: "🧹",
    },
    { id: categoryIds["coffee"], key: "coffee", label: "Coffee", icon: "☕" },
    {
      id: categoryIds["insurance"],
      key: "insurance",
      label: "Insurance",
      icon: "🛡️",
    },
    {
      id: categoryIds["clothing"],
      key: "clothing",
      label: "Clothing",
      icon: "👕",
    },
    {
      id: categoryIds["business"],
      key: "business",
      label: "Business",
      icon: "💼",
    },
    { id: categoryIds["cash"], key: "cash", label: "Cash", icon: "💵" },
    {
      id: categoryIds["general-purchases"],
      key: "general-purchases",
      label: "General Purchases",
      icon: "🛍️",
    },
    {
      id: categoryIds["parking"],
      key: "parking",
      label: "Parking",
      icon: "🅿️",
    },
    {
      id: categoryIds["books-stationary"],
      key: "books-stationary",
      label: "Books & Stationary",
      icon: "📚",
    },
    {
      id: categoryIds["alcohol"],
      key: "alcohol",
      label: "Alcohol",
      icon: "🍺",
    },
    {
      id: categoryIds["bank-fees"],
      key: "bank-fees",
      label: "Bank Fees",
      icon: "🏦",
    },
    {
      id: categoryIds["exception"],
      key: "exception",
      label: "Exception",
      icon: "⚠️",
    },
    {
      id: categoryIds["christmas-savings"],
      key: "christmas-savings",
      label: "Christmas Savings",
      icon: "🎄",
    },
    {
      id: categoryIds["travel-savings"],
      key: "travel-savings",
      label: "Travel Savings",
      icon: "✈️",
    },
  ];
}

export const defaultUserCategories = [
  "groceries",
  "savings",
  "entertainment",
  "medical",
  "general-purchases",
];

export async function seedCategories(
  categoriesToSeed?: Array<
    Omit<NewCategory, "createdAt" | "updatedAt" | "deletedAt">
  >,
) {
  const categoriesToInsert =
    categoriesToSeed || generateDefaultCategories(generateCategoryIds());

  try {
    console.log("Starting category seed...");

    const now = new Date();

    for (const category of categoriesToInsert) {
      await db
        .insert(categories)
        .values({
          ...category,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing();
    }

    console.log(`Seeded ${categoriesToInsert.length} categories successfully.`);
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
}

export async function seedUserCategories(
  userId: string,
  categoryIds: CategoryIds,
) {
  try {
    console.log(`Starting user categories seed for user ${userId}...`);

    const now = new Date();

    for (const categoryKey of defaultUserCategories) {
      const categoryId = categoryIds[categoryKey as keyof typeof categoryIds];

      if (categoryId) {
        await db
          .insert(userCategories)
          .values({
            id: generateUuid(),
            userId,
            categoryId,
            createdAt: now,
            updatedAt: now,
          })
          .onConflictDoNothing();
      }
    }

    console.log(
      `Seeded ${defaultUserCategories.length} user categories successfully.`,
    );
  } catch (error) {
    console.error("Error seeding user categories:", error);
    throw error;
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  seedCategories()
    .then(() => {
      console.log("Category seeding completed.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Category seeding failed:", error);
      process.exit(1);
    });
}
