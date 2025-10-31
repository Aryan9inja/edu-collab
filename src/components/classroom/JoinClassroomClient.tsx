"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Classroom, joinClassroom } from "@/services/classroom";
import { account } from "@/lib/appwrite";

interface JoinClassroomClientProps {
  classroom: Classroom;
}

export default function JoinClassroomClient({ classroom }: JoinClassroomClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
        
        // Check if user is already a member
        if (classroom.users?.includes(user.$id)) {
          setIsAlreadyMember(true);
        }
      } catch {
        // User not logged in, redirect to login
        router.push(`/auth/login?redirect=/classrooms/join/${classroom.$id}`);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [classroom, router]);

  const handleJoin = async () => {
    if (!userId) return;

    setJoining(true);
    setError(null);

    try {
      await joinClassroom(classroom.$id, userId);
      // Replace the current page in history so back button goes to classroom list
      router.replace(`/classrooms/${classroom.$id}`);
    } catch (err) {
      console.error("Error joining classroom:", err);
      setError("Failed to join classroom. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleGoToClassroom = () => {
    // Replace the current page in history so back button goes to classroom list
    router.replace(`/classrooms/${classroom.$id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isAlreadyMember ? "Already a Member!" : "Join Classroom"}
          </h1>
          <p className="text-gray-600">
            {isAlreadyMember 
              ? "You're already a member of this classroom"
              : "You've been invited to join"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 mb-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {classroom.name}
          </h2>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{classroom.users?.length || 0} members</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{classroom.notes?.length || 0} notes</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {isAlreadyMember ? (
            <button
              onClick={handleGoToClassroom}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Go to Classroom
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {joining ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Joining...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Join Classroom
                </>
              )}
            </button>
          )}

          <button
            onClick={() => router.push("/classrooms")}
            className="w-full px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 font-medium"
          >
            Back to My Classrooms
          </button>
        </div>
      </div>
    </div>
  );
}
