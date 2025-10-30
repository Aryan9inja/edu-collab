"use client";

import { Classroom, joinClassroom, listClassrooms } from "@/services/classroom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClassroomList() {
  const router = useRouter();
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

  const handleJoinDemo = async () => {
    setLoading(true);
    try {
      await joinClassroom(process.env.NEXT_PUBLIC_DEMO_CLASSROOM_ID!, userId);
      router.push(`/classrooms/${process.env.NEXT_PUBLIC_DEMO_CLASSROOM_ID!}`);
    } catch (error) {
      console.error("Error joining demo classroom:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <span className="text-gray-600 mt-4 font-medium">
          Loading classrooms...
        </span>
      </div>
    );
  }

  if (!classrooms.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-full mb-4">
          <svg
            className="w-16 h-16 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No classrooms yet
        </h3>
        <p className="text-gray-500 text-center max-w-sm">
          You haven't joined or created any classrooms. Create one to get
          started! Or join a Demo Classroom
          <button
            className="ml-2 text-blue-600 font-medium hover:underline"
            onClick={handleJoinDemo}
          >
            Join Demo
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {classrooms.map((classroom) => (
        <button
          key={classroom.$id}
          onClick={() => router.push(`/classrooms/${classroom.$id}`)}
          className="w-full group relative flex items-center gap-4 p-5 bg-gradient-to-r from-white to-blue-50/50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
              {classroom.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {classroom.users?.length || 0} member
              {classroom.users?.length !== 1 ? "s" : ""} •{" "}
              {classroom.notes?.length || 0} note
              {classroom.notes?.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Admin Badge */}
          {classroom.adminId === userId && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full border border-amber-200">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Admin
              </span>
            </div>
          )}

          {/* Arrow Icon */}
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
}
