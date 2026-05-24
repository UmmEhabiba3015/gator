import { readConfig, setUser } from "../../config";
import {
  createUser,
  getUserByName,
  resetUsers,
  getUsers,
} from "../db/queries/users";

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
