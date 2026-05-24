import console from "node:console";
import { getPostsForUser } from "../db/queries/posts";
import { User } from "./commands";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let limit = 2;
  if (args.length === 1) {
    let speecifiedLimit = parseInt(args[0]);
    if (speecifiedLimit) {
      limit = speecifiedLimit;
    } else {
      console.log(
        "Since limit was not provided so we will use default limit which is 2",
      );
    }
  }
  try {
    const posts = await getPostsForUser(user.id, limit);

    for (let i = 0; i < posts.length; i++) {
      console.log(`Published Date : ${posts[i].posts.publishedAt}`);
      console.log(`Title : ${posts[i].posts.title}`);
      console.log(`URL : ${posts[i].posts.url}`);
      console.log(`Description : ${posts[i].posts.description}`);
    }
  } catch (e) {
    console.log(e);
  }
}
