import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(username: string): void {
  const cfg: Config = {
    dbUrl: "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
    currentUserName: username,
  };
  writeConfig(cfg);
}

export function readConfig(): Config {
  const configFilePath = getConfigFilePath();
  const configFileContent = fs.readFileSync(configFilePath, "utf-8");
  const rawConfig = JSON.parse(configFileContent);
  return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const cfgStringify = JSON.stringify(cfg);
  fs.writeFileSync(getConfigFilePath(), cfgStringify);
}
function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("Invalid config format: expected an object");
  }
  return {
    dbUrl: rawConfig.dbUrl,
    currentUserName: rawConfig.currentUserName || "default_user",
  };
}
