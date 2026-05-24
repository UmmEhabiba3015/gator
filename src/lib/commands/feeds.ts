import { User } from "./commands";
import {
  createFeed,
  printFeed,
  getFeeds,
  createFeedFollow,
} from "../db/queries/feed";
import {
  getUserById,
} from "../db/queries/users";

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
