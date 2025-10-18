import { usersTable,databaseId } from "@/constans/appwrite";
import { database } from "@/lib/appwrite";
import { Models } from "appwrite";

interface User extends Models.Row {
  $id: string;
  $createdAt: string;
  username: string;
}

export const getUsername=async(userId:string):Promise<string>=>{
  try {
    const response: User = await database.getRow({
      databaseId,
      tableId: usersTable,
      rowId: userId,
    });
    return response.username;
  } catch (error) {
    throw error || new Error("Failed to get username");
  }
};

export const getUsernames=async(userIds:string[]):Promise<{id:string,name?:string}[]>=>{
  try {
    const promises = userIds.map(async (userId) => {
      try {
        const name = await getUsername(userId);
        return { id: userId, name };
      } catch (error) {
        console.error("Failed to get username for", userId, error);
        return { id: userId };
      }
    });
    return await Promise.all(promises);
  } catch (error) {
    throw error || new Error("Failed to get usernames");
  }
};
