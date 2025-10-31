"use client";

import InviteLinkButton from "./InviteLinkButton";
import type { Classroom } from "@/services/classroom";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface ClassroomHeaderProps {
  name: string;
  classroomId: string;
  classroom: Classroom;
}

export default function ClassroomHeader({ name, classroomId, classroom }: ClassroomHeaderProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user && classroom.adminId === user.$id;

  const handleBack = () => {
    router.push("/classrooms");
  };

  const handleLeaveClassroom = async () => {
    if (!user) return;

    setLeaving(true);
    try {
      const { leaveClassroom } = await import("@/services/classroom");
      await leaveClassroom(classroomId, user.$id);
      
      toast.success("Left classroom successfully");
      router.push("/classrooms");
    } catch (error) {
      console.error("Error leaving classroom:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to leave classroom");
      }
    } finally {
      setLeaving(false);
      setShowLeaveModal(false);
    }
  };

  const handleDeleteClassroom = async () => {
    if (!user) return;

    setDeleting(true);
    try {
      const { deleteClassroom } = await import("@/services/classroom");
      await deleteClassroom(classroomId, user.$id);

      toast.success("Classroom deleted successfully");
      router.push("/classrooms");
    } catch (error) {
      console.error("Error deleting classroom:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete classroom");
      }
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {/* Compact Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-200 sticky top-4 z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Back Button + Title */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={handleBack}
              className="flex-shrink-0 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Back to Classrooms"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent truncate">
              {name}
            </h1>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            <InviteLinkButton classroomId={classroomId} classroom={classroom} />
            
            {isAdmin ? (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-shrink-0 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Classroom"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-1.341 12.064A2 2 0 0115.673 21H8.327a2 2 0 01-1.986-1.936L5 7m5-3h4a1 1 0 011 1v1h4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 10l.867 8.142A1 1 0 0010.858 19h2.284a1 1 0 00.991-.858L15 10M10 7h4"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setShowLeaveModal(true)}
                className="flex-shrink-0 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                title="Leave Classroom"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Leave Classroom Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Leave Classroom?
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to leave <span className="font-semibold">{name}</span>? 
                You&apos;ll need a new invite link to rejoin.
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  disabled={leaving}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveClassroom}
                  disabled={leaving}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {leaving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Leaving...
                    </>
                  ) : (
                    "Leave Classroom"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delete Classroom?
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                This will permanently delete <span className="font-semibold">{name}</span> and all of its notes for every member. This action cannot be undone.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClassroom}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete Classroom"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
