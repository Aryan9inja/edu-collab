import { classroomTable, databaseId } from "@/constans/appwrite";
import { database, ID } from "@/lib/appwrite";
import { Query } from "appwrite";

interface CreateProps {
  userId: string;
  name: string;
}

const createClassroom = async ({ userId, name }: CreateProps) => {
  try {
    await database.createRow({
      databaseId,
      tableId: classroomTable,
      rowId: ID.unique(),
      data: {
        adminId: userId,
        name,
      },
    });
  } catch (error) {
    throw error || new Error("Failed to create classroom");
  }
};

const listClassrooms = async (userId: string) => {
  try {
    const response = await database.listRows({
      databaseId,
      tableId: classroomTable,
      queries: [
        Query.or([
          Query.equal("adminId", userId),
          Query.contains("users", userId),
        ]),
      ],
    });
    return response.rows;
  } catch (error) {
    throw error || new Error("Failed to list classrooms");
  }
};

export { createClassroom, listClassrooms };
