import { Client, Account, TablesDB, Storage } from "appwrite";

export const client = new Client();

let account: Account;
let database: TablesDB;
let storage: Storage;

try {
  if (
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  ) {
    client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
  } else {
    throw new Error("Please set ENV correctly");
  }

  account = new Account(client);
  database = new TablesDB(client);
  storage = new Storage(client);
} catch (error) {
  console.error(error);
}

export { account, database, storage };
export { ID } from "appwrite";
