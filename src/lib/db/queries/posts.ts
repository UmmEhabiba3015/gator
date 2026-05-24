import { db } from "..";
import { desc, eq, sql } from "drizzle-orm";
import { feedFollows, feeds, NewPost, posts, users } from "../schema";

export type User = typeof users.$inferSelect;

export async function createPost(newPost: NewPost) {
  try {
    const [post] = await db.insert(posts).values(newPost).returning();
    return post;
  } catch (e) {
    console.log(`Error while creating the post. \n ${JSON.stringify(e)}`);
    throw e;
  }
}

export async function getPostsForUser(userId: string, limit: number) {
  const postsForUser = await db
    .select()
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return postsForUser;
}
