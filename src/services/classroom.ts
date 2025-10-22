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
        users: [userId],
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

const updateClassroom = async (
  classroomId: string,
  data: Partial<Omit<Classroom, "$id" | "$createdAt" | "$updatedAt">>
): Promise<Classroom> => {
  try {
    const response: Classroom = await database.updateRow({
      databaseId,
      tableId: classroomTable,
      rowId: classroomId,
      data,
    });
    return response;
  } catch (error) {
    throw error || new Error("Failed to update classroom");
  }
};

const addNoteToClassroom = async (
  classroomId: string,
  noteId: string
): Promise<Classroom> => {
  try {
    // First get the current classroom to get existing notes
    const classroom = await getClassroom(classroomId);
    const currentNotes = classroom.notes || [];
    
    // Add the new note ID to the array
    const updatedNotes = [...currentNotes, noteId];
    
    // Update the classroom with the new notes array
    return await updateClassroom(classroomId, { notes: updatedNotes });
  } catch (error) {
    throw error || new Error("Failed to add note to classroom");
  }
};

const joinClassroom = async (
  classroomId: string,
  userId: string
): Promise<Classroom> => {
  try {
    // Get the current classroom
    const classroom = await getClassroom(classroomId);
    const currentUsers = classroom.users || [];
    
    // Check if user is already in the classroom
    if (currentUsers.includes(userId)) {
      return classroom; // User already a member
    }
    
    // Add the new user ID to the array
    const updatedUsers = [...currentUsers, userId];
    
    // Update the classroom with the new users array
    return await updateClassroom(classroomId, { users: updatedUsers });
  } catch (error) {
    throw error || new Error("Failed to join classroom");
  }
};

export { 
  createClassroom, 
  listClassrooms, 
  getClassroom, 
  updateClassroom, 
  addNoteToClassroom,
  joinClassroom 
};
