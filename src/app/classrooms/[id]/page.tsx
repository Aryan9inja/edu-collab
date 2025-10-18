"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Classroom, getClassroom } from "@/services/classroom";
import { getUsernames } from "@/services/users";

export default function ClassroomPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [classroomData, setClassroomData] = useState<Classroom | null>(null);
  const [usernames, setUsernames] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const data = await getClassroom(id);
        setClassroomData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching classroom:", error);
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [id]);

  useEffect(() => {
    const fetchUsernames = async () => {
      if (classroomData && classroomData.users && classroomData.users.length > 0) {
        try {
          const usernameData = await getUsernames(classroomData.users);
          setUsernames(usernameData.map((u) => u.name || u.id));
        } catch (error) {
          console.error("Error fetching usernames:", error);
        }
      }
    };
    
    fetchUsernames();
  }, [classroomData]);

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center py-8 overflow-hidden">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!classroomData) {
    return (
      <div className="flex flex-1 justify-center items-center py-8 overflow-hidden">
        <span className="text-gray-500">Classroom not found</span>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold mb-2">{classroomData.name}</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <ul className="list-disc list-inside">
          {usernames.map((username) => (
            <li key={username} className="font-mono text-sm">
              {username}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Notes</h2>
        <div className="space-y-4">
          {classroomData.notes?.length === 0 && (
            <div className="p-4 border rounded bg-gray-50">
              <h3 className="font-semibold mb-1">No notes available</h3>
            </div>
          )}
          {classroomData.notes?.map((noteId) => (
            <div key={noteId} className="p-4 border rounded bg-gray-50">
              <h3 className="font-semibold mb-1">
                Note ID: <span className="font-mono text-sm">{noteId}</span>
              </h3>
              <p className="text-gray-700">
                This is a placeholder for note content.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
