import { notesStorage } from "@/constans/appwrite";
import { ID, storage } from "@/lib/appwrite";
import { addNoteToClassroom } from "./classroom";

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

export const uploadNote = async (file: File, classroomId: string) => {
  try {
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
