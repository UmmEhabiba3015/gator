import { url } from "node:inspector";
import { User, UserCommandHandler } from "./commands";
import { readConfig, setUser } from "./config";
import {
  createFeed,
  printFeed,
  getFeeds,
  createFeedFollow,
  getFeedByURL,
  getFeedFollowsForUser,
  deleteFeedFollowsForUser,
} from "./lib/db/queries/feed";
import {
  createUser,
  getUserByName,
  getUserById,
  resetUsers,
  getUsers,
  fetchFeed,
} from "./lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  const user = await getUserByName(args[0]);
  if (args.length === 0) {
    throw new Error("Username is required for login command");
  }
  if (user === undefined) {
    throw new Error("User not found");
  }
  setUser(user.name);
  console.log(`User: ${user.name} has been logged in.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Username is required for register command");
  }
  const user = await createUser(args[0]);
  if (user === undefined) {
    throw new Error("User already exists");
  }
  console.log(`User: ${user.name} has been registered.`);
  setUser(user.name);
  console.log(`User's data: ${JSON.stringify(user)}`);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  const response = await resetUsers();
  console.log("All users have been reset");
  return response;
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
  const response = await getUsers();
  const config = readConfig();
  response?.forEach((user) => {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  });
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
  const response = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(response);
}

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const name = args[0];
  const url = args[1];

  const feed = await createFeed(url, user.id, name);
  printFeed(feed, user);

  await createFeedFollow(user.id, feed.id);
  console.log(`User ${user.name} is now following feed ${feed.name}`);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds();

  console.log("Feeds:");
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    console.log(`Name : ${feed.name}`);
    console.log(`URL: ${feed.url}`);
    console.log(`Added by: ${user?.name}`);
  }
}

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
  await deleteFeedFollowsForUser(user, args[0]);
  console.log(`Feed record of ${args[0]} for the user ${user.name} has been deleted successfully`);
}