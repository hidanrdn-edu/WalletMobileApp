import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as SecureStore from "expo-secure-store";

import { db, sqliteDb } from "@/db/client";
import { users, type User } from "@/db/schema";
import { ensureDefaultCategoriesForUser } from "@/services/categories";

const SESSION_USER_ID_KEY = "userId";
const BCRYPT_SALT_ROUNDS = 10;

function sqliteRandomBytes(length: number) {
  const row = sqliteDb.getFirstSync<{ value: string }>(
    "SELECT hex(randomblob(?)) AS value",
    length
  );

  if (!row?.value || row.value.length !== length * 2) {
    throw new Error("Could not generate secure random bytes for password hashing.");
  }

  const bytes: number[] = [];

  for (let index = 0; index < row.value.length; index += 2) {
    bytes.push(Number.parseInt(row.value.slice(index, index + 2), 16));
  }

  return bytes;
}

bcrypt.setRandomFallback(sqliteRandomBytes);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeName(name: string) {
  return name.trim();
}

function assertCredentials(email: string, password: string) {
  if (!email.trim()) {
    throw new Error("Email is required.");
  }

  if (!password.trim()) {
    throw new Error("Password is required.");
  }
}

async function saveSession(userId: number) {
  await SecureStore.setItemAsync(SESSION_USER_ID_KEY, String(userId));
}

async function findUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  return user ?? null;
}

async function findUserById(userId: number) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  return user ?? null;
}

function isUniqueEmailError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("users.email") ||
    error.message.includes("users_email_unique") ||
    error.message.includes("UNIQUE constraint failed")
  );
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  const normalizedName = normalizeName(name);
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedName) {
    throw new Error("Name is required.");
  }

  assertCredentials(normalizedEmail, password);

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    await db.insert(users).values({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
    });
  } catch (error) {
    if (isUniqueEmailError(error)) {
      throw new Error("An account with this email already exists.");
    }

    throw error;
  }

  const createdUser = await findUserByEmail(normalizedEmail);

  if (!createdUser) {
    throw new Error("User registration failed.");
  }

  await ensureDefaultCategoriesForUser(createdUser.id);

  await saveSession(createdUser.id);

  return createdUser;
}

export async function loginUser(email: string, password: string): Promise<User> {
  assertCredentials(email, password);

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid password.");
  }

  await ensureDefaultCategoriesForUser(user.id);

  await saveSession(user.id);

  return user;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_USER_ID_KEY);
}

export async function getCurrentUser(): Promise<User | null> {
  const storedUserId = await SecureStore.getItemAsync(SESSION_USER_ID_KEY);

  if (!storedUserId) {
    return null;
  }

  const userId = Number(storedUserId);

  if (Number.isNaN(userId)) {
    await logout();
    return null;
  }

  const user = await findUserById(userId);

  if (!user) {
    await logout();
    return null;
  }

  await ensureDefaultCategoriesForUser(user.id);

  return user;
}
