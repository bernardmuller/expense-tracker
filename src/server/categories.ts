import { and, eq, isNull } from 'drizzle-orm';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { db } from '../db/index';
import { categories, userCategories } from '../db/schema';
import { defaultUserCategories } from '../db/seed-categories';
import { getAllCategoriesByUserId } from './queries/categories';

const createCategoryDataSchema = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.string().optional()
})


const updateCategoryDataSchema = z.object({
  categoryId: z.number(),
  label: z.string(),
  icon: z.string().optional()
})

const userCategoryDataSchema = z.object({
  userId: z.string(),
  categoryId: z.number(),
})

export type CreateCategoryData = z.infer<typeof createCategoryDataSchema>
export type UpdateCategoryData = z.infer<typeof updateCategoryDataSchema>
export type userCategoryData = z.infer<typeof userCategoryDataSchema>

export const getAllCategories = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await db
      .select()
      .from(categories)
      .where(isNull(categories.deletedAt))
  })

export const getUserCategories = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return getAllCategoriesByUserId(data.userId)
  })

export const getUserActiveCategories = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const result = await db
      .select({
        id: categories.id,
        key: categories.key,
        label: categories.label,
        icon: categories.icon,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        deletedAt: categories.deletedAt,
      })
      .from(userCategories)
      .innerJoin(categories, eq(userCategories.categoryId, categories.id))
      .where(
        and(
          eq(userCategories.userId, data.userId),
          isNull(userCategories.deletedAt),
          isNull(categories.deletedAt)
        )
      )
      .orderBy(categories.label);

    return result;
  })

export const createCategory = createServerFn({ method: 'POST' })
  .validator(createCategoryDataSchema)
  .handler(async ({ data }) => {
    const [category] = await db
      .insert(categories)
      .values({
        key: data.key,
        label: data.label,
        icon: data.icon || '',
      })
      .returning();

    return category;
  })

export const updateCategory = createServerFn({ method: 'POST' })
  .validator(updateCategoryDataSchema)
  .handler(async ({ data }) => {
    const [category] = await db
      .update(categories)
      .set({
        ...(data.label && { label: data.label }),
        ...(data.icon !== undefined && { icon: data.icon }),
        updatedAt: new Date(),
      })
      .where(eq(categories.id, data.categoryId))
      .returning();

    return category;
  })

export const deleteCategory = createServerFn({ method: 'POST' })
  .validator(z.object({ categoryId: z.number() }))
  .handler(async ({ data }) => {
    await db
      .update(categories)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(categories.id, data.categoryId));
  })

export const addUserCategory = createServerFn({ method: 'POST' })
  .validator(userCategoryDataSchema)
  .handler(async ({ data }) => {
    const existingUserCategory = await db
      .select()
      .from(userCategories)
      .where(
        and(
          eq(userCategories.userId, data.userId),
          eq(userCategories.categoryId, data.categoryId)
        )
      )
      .limit(1);

    if (existingUserCategory.length > 0) {
      const existing = existingUserCategory[0];
      if (existing.deletedAt) {
        const [reactivated] = await db
          .update(userCategories)
          .set({
            deletedAt: null,
            updatedAt: new Date(),
          })
          .where(eq(userCategories.id, existing.id))
          .returning();

        return reactivated;
      }
      return existing;
    }

    const [userCategory] = await db
      .insert(userCategories)
      .values({
        userId: data.userId,
        categoryId: data.categoryId,
      })
      .returning();

    return userCategory;
  })

export const removeUserCategory = createServerFn({ method: 'POST' })
  .validator(userCategoryDataSchema)
  .handler(async ({ data }) => {
    await db
      .update(userCategories)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userCategories.userId, data.userId),
          eq(userCategories.categoryId, data.categoryId)
        )
      );
  })

export const setupDefaultUserCategories = createServerFn({ method: 'POST' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const allCategories = await getAllCategories();
    const defaultCategories = allCategories.filter(cat =>
      defaultUserCategories.includes(cat.key)
    );

    const userCategoryPromises = defaultCategories.map(async category =>
      await db
        .insert(userCategories)
        .values({
          userId: data.userId,
          categoryId: category.id,
        })
        .returning()

    );

    return Promise.all(userCategoryPromises);
  })

export const getCategoryByKey = createServerFn({ method: 'GET' })
  .validator(z.object({ key: z.string() }))
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.key, data.key),
          isNull(categories.deletedAt)
        )
      )
      .limit(1);

    return result[0] || null;
  })
