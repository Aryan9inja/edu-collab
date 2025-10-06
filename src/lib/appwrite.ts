import { Client, Account } from "appwrite";

export const client = new Client();

let account: Account;

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
} catch (error) {
  console.error(error);
}

export { account };
export { ID } from "appwrite";
