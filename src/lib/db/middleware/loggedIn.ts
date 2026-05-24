import { CommandHandler, UserCommandHandler } from "src/lib/commands/commands";
import { readConfig } from "src/config";
import { getUserByName } from "../queries/users";

export type middlewareLoggedIn = (
  handler: UserCommandHandler,
) => CommandHandler;

export const middlewareLoggedInFunc: middlewareLoggedIn = (
  userCommandHandler: UserCommandHandler,
) => {
  return async (cmdName, ...args) => {
    const userName = readConfig().currentUserName;

    const user = await getUserByName(userName);
    if (!user) {
      throw new Error("User not found");
    }

    return userCommandHandler(cmdName, user, ...args);
  };
};
