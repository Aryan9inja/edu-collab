const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB!;
const classroomTable = process.env.NEXT_PUBLIC_APPWRITE_CLASSROOM_TABLE!;
const usersTable = process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE!;
const notesStorage = process.env.NEXT_PUBLIC_APPWRITE_NOTES_BUCKET!;

export { databaseId, classroomTable, usersTable, notesStorage };
