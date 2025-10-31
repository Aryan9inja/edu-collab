import { usersTable, databaseId } from "@/constans/appwrite";
import { database } from "@/lib/appwrite";
import { Models } from "appwrite";

interface User extends Models.Row {
  $id: string;
  $createdAt: string;
  username: string;
}

export const getUsername = async (userId: string): Promise<string> => {
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

export const getUsernames = async (
  userIds: string[]
): Promise<{ id: string; name?: string }[]> => {
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

export const createUsername = async (
  userId: string,
  username: string
): Promise<void> => {
  try {
    // Validate username
    if (!username || username.trim().length === 0) {
      throw new Error("Username cannot be empty");
    }

    const trimmedUsername = username.trim();

    // Check if username length is valid (3-20 characters)
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      throw new Error("Username must be between 3 and 20 characters");
    }

    // Check if username contains only alphanumeric characters, underscores, and hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      throw new Error(
        "Username can only contain letters, numbers, underscores, and hyphens"
      );
    }

    await database.createRow({
      databaseId,
      tableId: usersTable,
      rowId: userId,
      data: { username: trimmedUsername },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create username");
  }
};

export const checkUsernameExists = async (
  username: string
): Promise<boolean> => {
  try {
    const response = await database.listRows({
      databaseId,
      tableId: usersTable,
      queries: [],
    });

    // Check if any row has the same username (case-insensitive)
    const exists = response.rows.some(
      (row) => {
        const userRow = row as unknown as User;
        return userRow.username?.toLowerCase() === username.toLowerCase();
      }
    );

    return exists;
  } catch (error) {
    console.error("Failed to check username existence:", error);
    return false;
  }
};

export const searchUsersByUsername = async (
  searchQuery: string,
  classroomUserIds: string[]
): Promise<{ id: string; name: string }[]> => {
  try {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return [];
    }

    if (!classroomUserIds || classroomUserIds.length === 0) {
      return [];
    }

    // Get usernames only for users in the classroom
    const usernames = await getUsernames(classroomUserIds);

    // Filter by search query (case-insensitive) and limit to 10 results
    const filteredUsers = usernames
      .filter((userData) => {
        if (!userData.name) return false;
        const username = userData.name.toLowerCase();
        return username.includes(searchQuery.toLowerCase());
      })
      .slice(0, 10) // Limit to 10 results
      .map((userData) => ({
        id: userData.id,
        name: userData.name!,
      }));

    return filteredUsers;
  } catch (error) {
    console.error("Failed to search users:", error);
    throw new Error("Failed to search users");
  }
};
