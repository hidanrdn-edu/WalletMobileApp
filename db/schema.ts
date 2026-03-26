import {integer, sqliteTable, text, real} from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
})

export type User = typeof users.$inferSelect;

export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id), 
  name: text("name").notNull(),
  balance: real("balance").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Account = typeof accounts.$inferSelect;

export const categories = sqliteTable("categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    type: text("type").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type Category = typeof categories.$inferSelect;

export const transactions = sqliteTable("transactions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id),
    accountId: integer("account_id").notNull().references(() => accounts.id),
    categoryId: integer("category_id").notNull().references(() => categories.id),
    amount: real("amount").notNull(),
    type: text("type").notNull(),
    description: text("description").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}) 

export type Transaction = typeof transactions.$inferSelect;