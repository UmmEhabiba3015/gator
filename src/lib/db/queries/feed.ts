import { db } from "..";
import { eq, sql } from "drizzle-orm";
import { feeds, users, feedFollows } from "../schema";
import { firstOrUndefined } from "./utils";

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export async function createFeed(url: string, userId: string, name: string) {
  try {
    const [result] = await db
      .insert(feeds)
      .values({ url: url, userId: userId, name: name })
      .returning();

    return result;
  } catch (error: any) {
    throw error;
  }
}

export function printFeed(feed: Feed, user: User) {
  console.log(`Feed: ${JSON.stringify(feed)}`);
  console.log(`Added by: ${JSON.stringify(user)}`);
}

export async function getFeeds() {
  try {
    const result = await db.select().from(feeds);
    return result;
  } catch (error: any) {
    throw error;
  }
}

export async function getFeedByURL(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();
  const record = await db
    .select({
      feedFollows: {
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
      },
      feeds: {
        id: feeds.id,
        name: feeds.name,
        url: feeds.url,
      },
      users: {
        id: users.id,
        name: users.name,
      },
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id));
  return { newFeedFollow, record };
}

export async function getFeedFollowsForUser(user: User) {
  const feedFollow = await db
    .select({
      name: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(users.id, user.id));
  return feedFollow;
}

export async function deleteFeedFollowsForUser(url: string) {
  await db.delete(feeds).where(eq(feeds.url, url));
};

export async function markFeedFetched(feedId: string) {
  const result = await db
    .update(feeds)
    .set({
      last_fetched_at: new Date(),
    })
    .where(eq(feeds.id, feedId))
    .returning();
  return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.last_fetched_at} asc nulls first`)
    .limit(1);
  return firstOrUndefined(result);
}