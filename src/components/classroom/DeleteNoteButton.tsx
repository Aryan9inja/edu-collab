"use client";

import { useState } from "react";
import { deleteNote } from "@/services/notes";
import { deleteNoteFromClassroom, checkUserAccess } from "@/services/classroom";
import type { Classroom } from "@/services/classroom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { FaTrash } from "react-icons/fa";

interface DeleteNoteButtonProps {
  noteId: string;
  classroom: Classroom;
  onDeleteSuccess?: () => void;
}

export default function DeleteNoteButton({
  noteId,
  classroom,
  onDeleteSuccess,
}: DeleteNoteButtonProps) {
  const { user } = useAuthStore();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user) return null;

  // Check if user has permission to delete
  const canDelete = checkUserAccess(classroom, user.$id);

  const handleDelete = async () => {
    if (!user || !canDelete) return;

    setDeleting(true);
    try {
      // Delete from classroom database first
      await deleteNoteFromClassroom(classroom.$id, noteId, user.$id);

      // Then delete from storage
      await deleteNote(noteId);
      toast.success("Note deleted successfully");
      setShowConfirm(false);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete note"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleClick = () => {
    if (!canDelete) return;
    setShowConfirm(true);
  };

  if (showConfirm && canDelete) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={deleting}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        disabled={!canDelete}
        className={`peer p-2 rounded-lg transition-all ${
          canDelete
            ? "bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
        }`}
      >
        <FaTrash className="w-4 h-4" />
      </button>
      
      {/* Tooltip for users without access */}
      {!canDelete && (
        <div className="invisible peer-hover:visible absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 transition-all whitespace-normal pointer-events-none">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>Only admins and allowed members can delete notes</p>
          </div>
          {/* Arrow */}
          <div className="absolute right-3 -top-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}
