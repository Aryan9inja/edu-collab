import { classroomTable, databaseId } from "@/constans/appwrite";
import { database, ID } from "@/lib/appwrite";
import { Models, Query } from "appwrite";

interface CreateProps {
  userId: string;
  name: string;
}

export interface Classroom extends Models.Row {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  adminId: string;
  users?: string[];
  notes?: string[];
}

const createClassroom = async ({
  userId,
  name,
}: CreateProps): Promise<Classroom> => {
  try {
    const response: Classroom = await database.createRow({
      databaseId,
      tableId: classroomTable,
      rowId: ID.unique(),
      data: {
        adminId: userId,
        name,
      },
    });
    return response;
  } catch (error: unknown) {
    throw error || new Error("Failed to create classroom");
  }
};

const listClassrooms = async (userId: string): Promise<Classroom[]> => {
  try {
    const response: { rows: Classroom[] } = await database.listRows({
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

const getClassroom = async (classroomId: string): Promise<Classroom> => {
  try {
    const response: Classroom = await database.getRow({
      databaseId,
      tableId: classroomTable,
      rowId: classroomId,
    });
    return response;
  } catch (error) {
    throw error || new Error("Failed to get classroom details");
  }
};

export { createClassroom, listClassrooms,getClassroom };
