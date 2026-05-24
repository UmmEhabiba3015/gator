import { Feed, getNextFeedToFetch, markFeedFetched } from "../db/queries/feed";
import { fetchFeed } from "../rss";
import { parseDuration } from "../time";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }
  const timeArg = args[0];
  const timeBetweenFeed = parseDuration(timeArg);
  if (!timeBetweenFeed) {
    throw new Error(`Invalid duration ${timeArg} use 1h 30m 15s 2000ms`);
  }
  console.log(`Collecting feeds every ${timeArg}`);
  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenFeed);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    console.log(`No feeds to fetch.`);
    return;
  }
  console.log(`Found a feed to fetch!`);
  await scrapeFeed(nextFeed);
}

export async function scrapeFeed(feed: Feed) {
  const feedData = await fetchFeed(feed.url);
  for (const item of feedData.channel.item) {
    console.log(item.title);
  }
  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}
function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}
