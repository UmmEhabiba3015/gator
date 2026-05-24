import { User } from "./commands";
import {
  createFeedFollow,
  getFeedByURL,
  getFeedFollowsForUser,
  deleteFeedFollowsForUser,
} from "../db/queries/feed";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const url = args[0];

  const feed = await getFeedByURL(url);
  if (!feed) {
    throw new Error("Feed not found");
  }

  await createFeedFollow(user.id, feed.id);
  console.log(`User ${user.name} is now following feed ${feed.name}`);
}

export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feedFollows = await getFeedFollowsForUser(user);
  console.log(`Feeds followed by ${user.name}:`);
  for (const feedFollow of feedFollows) {
    console.log(`- ${feedFollow.name}`);
  }
}

export async function handlerUnfollow(cmdName: string, user:User, ...args: string[]){
  await deleteFeedFollowsForUser(args[0]);
  console.log(`Feed record of ${args[0]} for the user ${user.name} has been deleted successfully`);
}