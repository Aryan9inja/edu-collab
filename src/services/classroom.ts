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
  hasAccess?: string[]; // Optional field to track users with access
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
        hasAccess: [userId], // Admin has access by default
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

// Check if user has access to modify classroom
const checkUserAccess = (classroom: Classroom, userId: string): boolean => {
  // Admin always has access
  if (classroom.adminId === userId) {
    return true;
  }
  
  // Check if user is in hasAccess array
  const hasAccessList = classroom.hasAccess || [];
  return hasAccessList.includes(userId);
};

// Grant access to a user
const grantAccess = async (
  classroomId: string,
  userId: string,
  requestingUserId: string
): Promise<Classroom> => {
  try {
    const classroom = await getClassroom(classroomId);
    
    // Check if requesting user has permission (must be admin or have access)
    if (!checkUserAccess(classroom, requestingUserId)) {
      throw new Error("You don't have permission to grant access");
    }
    
    const currentAccess = classroom.hasAccess || [];
    
    // Check if user already has access
    if (currentAccess.includes(userId)) {
      return classroom; // User already has access
    }
    
    // Add the new user ID to hasAccess array
    const updatedAccess = [...currentAccess, userId];
    
    return await updateClassroom(classroomId, { hasAccess: updatedAccess });
  } catch (error) {
    throw error || new Error("Failed to grant access");
  }
};

// Revoke access from a user
const revokeAccess = async (
  classroomId: string,
  userId: string,
  requestingUserId: string
): Promise<Classroom> => {
  try {
    const classroom = await getClassroom(classroomId);
    
    // Only admin can revoke access
    if (classroom.adminId !== requestingUserId) {
      throw new Error("Only admin can revoke access");
    }
    
    // Cannot revoke admin's access
    if (userId === classroom.adminId) {
      throw new Error("Cannot revoke admin's access");
    }
    
    const currentAccess = classroom.hasAccess || [];
    const updatedAccess = currentAccess.filter(id => id !== userId);
    
    return await updateClassroom(classroomId, { hasAccess: updatedAccess });
  } catch (error) {
    throw error || new Error("Failed to revoke access");
  }
};

// Delete a note from classroom
const deleteNoteFromClassroom = async (
  classroomId: string,
  noteId: string,
  userId: string
): Promise<Classroom> => {
  try {
    const classroom = await getClassroom(classroomId);
    
    // Check if user has access to delete
    if (!checkUserAccess(classroom, userId)) {
      throw new Error("You don't have permission to delete notes");
    }
    
    const currentNotes = classroom.notes || [];
    const updatedNotes = currentNotes.filter(id => id !== noteId);
    
    return await updateClassroom(classroomId, { notes: updatedNotes });
  } catch (error) {
    throw error || new Error("Failed to delete note from classroom");
  }
};

// Leave a classroom
const leaveClassroom = async (
  classroomId: string,
  userId: string
): Promise<Classroom> => {
  try {
    const classroom = await getClassroom(classroomId);
    
    // Cannot leave if you're the admin
    if (userId === classroom.adminId) {
      throw new Error("Admin cannot leave the classroom");
    }
    
    // Remove user from users array
    const currentUsers = classroom.users || [];
    const updatedUsers = currentUsers.filter(id => id !== userId);
    
    // Remove user from hasAccess array if they have access
    const currentAccess = classroom.hasAccess || [];
    const updatedAccess = currentAccess.filter(id => id !== userId);
    
    return await updateClassroom(classroomId, { 
      users: updatedUsers,
      hasAccess: updatedAccess 
    });
  } catch (error) {
    throw error || new Error("Failed to leave classroom");
  }
};

export { 
  createClassroom, 
  listClassrooms, 
  getClassroom, 
  updateClassroom, 
  addNoteToClassroom,
  joinClassroom,
  checkUserAccess,
  grantAccess,
  revokeAccess,
  deleteNoteFromClassroom,
  leaveClassroom
};
