import { db } from "..";
import { eq } from "drizzle-orm";
import { feeds, users, feedFollows } from "../schema";

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
};
 
export async function getFeedByURL(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db.insert(feedFollows).values({ userId, feedId }).returning();
  const record = await db.select({
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
    }
  }).from(feedFollows).innerJoin(feeds, eq(feedFollows.feedId, feeds.id)).innerJoin(users, eq(feedFollows.userId, users.id));
  return {newFeedFollow,record};
};

export async function getFeedFollowsForUser (user: User) {
  const feedFollow = await db.select({
    name: feeds.name,
    userName: users.name, 
  }).from(feedFollows).innerJoin(feeds, eq(feedFollows.feedId, feeds.id)).innerJoin(users, eq(feedFollows.userId, users.id)).where(eq(users.id, user.id));
  return feedFollow;
}

export async function deleteFeedFollowsForUser (user: User, url: string){
  const deleteFeedFollow = await db.delete(feeds).where(eq(feeds.url, url));
}