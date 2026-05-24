import { argv } from "node:process";
import { readConfig } from "./config";
import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./lib/commands/commands";
import {
  handlerFollow,
  handlerFollowing,
  handlerUnfollow,
} from "./lib/commands/feed_follows";
import { handlerAddFeed, handlerFeeds } from "./lib/commands/feeds";
import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
} from "./lib/commands/users";
import {
  handlerAgg,
} from "./lib/commands/aggregate";
import { middlewareLoggedInFunc } from "./lib/db/middleware/loggedIn";

async function main() {
  const userInput: string[] = [];
  argv.forEach((val) => {
    userInput.push(val);
  });

  const commands = userInput.slice(2);

  if (commands.length === 0) {
    console.log("No command provided");
    process.exit(1);
  }
  const cmdName = commands[0];
  const args = commands.slice(1);

  const registry: CommandsRegistry = {};
  switch (cmdName) {
    case "register":
      registerCommand(registry, "register", handlerRegister);
      break;
    case "login":
      registerCommand(registry, "login", handlerLogin);
      break;
    case "reset":
      registerCommand(registry, "reset", handlerReset);
      break;
    case "users":
      registerCommand(registry, "users", handlerUsers);
      break;
    case "agg":
      registerCommand(registry, "agg", handlerAgg);
      break;
    case "addfeed":
      registerCommand(
        registry,
        "addfeed",
        middlewareLoggedInFunc(handlerAddFeed),
      );
      break;
    case "feeds":
      registerCommand(registry, "feeds", handlerFeeds);
      break;
    case "follow":
      registerCommand(
        registry,
        "follow",
        middlewareLoggedInFunc(handlerFollow),
      );
      break;
    case "following":
      registerCommand(
        registry,
        "following",
        middlewareLoggedInFunc(handlerFollowing),
      );
      break;
    case "unfollow":
      registerCommand(
        registry,
        "unfollow",
        middlewareLoggedInFunc(handlerUnfollow),
      );
      break;
    default:
      console.log("Invalid command");
      process.exit(1);
  }

  try {
    await runCommand(registry, cmdName, ...args);
  } catch (error: any) {
    console.log(error.message);
    process.exit(1);
  }

  const readConfigContent = readConfig();
  const configObject = JSON.parse(JSON.stringify(readConfigContent));

  process.exit(0);
}

main();
