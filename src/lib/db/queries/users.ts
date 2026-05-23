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

export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });
  const resolvedResponse = await response.text();
  const parser = new XMLParser({ processEntities: false });
  const parsed = parser.parse(resolvedResponse);

  const channel = parsed.rss.channel;
  if (!channel) {
    console.log("Invalid feed");
  }

  if (!channel.title || !channel.link || !channel.description) {
    console.log("Invalid channel data");
  }
  const metaData = {
    title: channel.title,
    link: channel.link,
    description: channel.description,
  };

  let items = [];
  if (channel.item) {
    items = Array.isArray(channel.item) ? channel.item : [channel.item];
  }

  const extractedItems = items.map((item: any) => {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      console.log("Invalid item data");
    }
    return {
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: new Date(item.pubDate),
    };
  });

  const result = {
    meta: metaData,
    items: extractedItems,
  };
  return result;
}

export async function getUserById(id: string) {
  try {
    const [result] = await db.select().from(users).where(eq(users.id, id));
    return result;
  } catch (error: any) {
    throw error;
  }
}
