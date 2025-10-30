import { notesStorage } from "@/constans/appwrite";
import { ID, storage } from "@/lib/appwrite";
import { addNoteToClassroom, getClassroom, checkUserAccess } from "./classroom";

export const getNote = (noteId: string) => {
  return storage.getFileView({
    bucketId: notesStorage,
    fileId: noteId,
  });
};

export const getMetaData = async (noteId: string) => {
  return await storage.getFile({
    bucketId: notesStorage,
    fileId: noteId,
  });
}

export const getFileDownloadLink = (noteId: string) => {
  return storage.getFileDownload({
    bucketId: notesStorage,
    fileId: noteId,
  });
}

export const uploadNote = async (file: File, classroomId: string, userId: string) => {
  try {
    // Check if user has access to upload notes
    const classroom = await getClassroom(classroomId);
    if (!checkUserAccess(classroom, userId)) {
      throw new Error("You don't have permission to upload notes to this classroom");
    }

    // Step 1: Upload file to storage
    const response = await storage.createFile({
      bucketId: notesStorage,
      file,
      fileId: ID.unique(),
    });

    // Step 2: Add the file ID to the classroom's notes array
    await addNoteToClassroom(classroomId, response.$id);

    return response;
  } catch (error) {
    // If database update fails, you might want to delete the uploaded file
    // to maintain consistency, but that's optional
    throw error || new Error("Failed to upload note");
  }
}

export const deleteNote = async (noteId: string, userId: string) => {
  try {
    // Note: You might want to check permissions here as well
    // For now, we'll just delete from storage
    await storage.deleteFile({
      bucketId: notesStorage,
      fileId: noteId,
    });
  } catch (error) {
    throw error || new Error("Failed to delete note");
  }
};
