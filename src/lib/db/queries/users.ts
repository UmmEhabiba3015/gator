import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { XMLParser } from "fast-xml-parser";

export async function createUser(name: string) {
  try {
    const [result] = await db.insert(users).values({ name: name }).returning();
    console.log(`${result.name} created successfully`);
    return result;
  } catch (error: any) {
    console.error(`Error creating user`);
  }
}

export async function getUserByName(name: string) {
  try {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
  } catch (error: any) {
    console.error("Error fetching user");
  }
}

export async function resetUsers() {
  try {
    await db.delete(users);
  } catch (error: any) {
    console.error("Error resetting users");
  }
}

export async function getUsers() {
  try {
    const result = await db.select().from(users);
    return result;
  } catch (error: any) {
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const [result] = await db.select().from(users).where(eq(users.id, id));
    return result;
  } catch (error: any) {
    throw error;
  }
}
