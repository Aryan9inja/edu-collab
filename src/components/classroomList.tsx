"use client";

import { Classroom, listClassrooms } from "@/services/classroom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClassroomList() {
  const router =useRouter()
  const { user } = useAuthStore();
  const userId = user?.$id || "";
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        const data = await listClassrooms(userId);
        setClassrooms(data);
      } catch (e) {
        setClassrooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClassrooms();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center py-8 overflow-hidden">
        <span className="text-gray-500 animate-pulse">Loading classrooms...</span>
      </div>
    );
  }

  if (!classrooms.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-8 overflow-hidden">
        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5" />
        </svg>
        <span className="text-gray-500">No classrooms found.</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="space-y-4 pr-2">
        {classrooms.map((classroom) => (
          <li
            key={classroom.$id}
            className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition-colors"
            onClick={() => router.push(`/classrooms/${classroom.$id}`)}
          >
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-lg font-semibold text-blue-800">{classroom.name}</span>
            </div>
            {classroom.adminId === userId && (
              <span className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded">Admin</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
