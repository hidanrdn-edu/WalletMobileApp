import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { categories, type Category } from "@/db/schema";

export type CategoryType = "income" | "expense";

const DEFAULT_CATEGORIES: Record<CategoryType, string[]> = {
  income: ["Зарплата", "Подарунок", "Премія"],
  expense: ["Їжа і напої", "Оренда", "Подарунки", "Розваги", "Ігри"],
};

export async function listCategoriesByUserAndType(
  userId: number,
  type: CategoryType,
): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .where(and(eq(categories.userId, userId), eq(categories.type, type)));
}

export async function ensureDefaultCategoriesForUser(userId: number): Promise<void> {
  const existingCategories = await db
    .select({ name: categories.name, type: categories.type })
    .from(categories)
    .where(eq(categories.userId, userId));

  const existingKeys = new Set(
    existingCategories.map((category) => `${category.type}:${category.name}`),
  );

  const valuesToInsert = (Object.keys(DEFAULT_CATEGORIES) as CategoryType[])
    .flatMap((type) =>
      DEFAULT_CATEGORIES[type].map((name) => ({
        userId,
        type,
        name,
      })),
    )
    .filter((category) => !existingKeys.has(`${category.type}:${category.name}`));

  if (!valuesToInsert.length) {
    return;
  }

  await db.insert(categories).values(valuesToInsert);
}