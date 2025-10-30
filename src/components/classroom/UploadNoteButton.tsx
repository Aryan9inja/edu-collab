"use client";

import { useState, useRef } from "react";
import { uploadNote } from "@/services/notes";
import { checkUserAccess } from "@/services/classroom";
import type { Classroom } from "@/services/classroom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface UploadNoteButtonProps {
  classroomId: string;
  classroom: Classroom;
  onUploadSuccess?: () => void;
}

export default function UploadNoteButton({ classroomId, classroom, onUploadSuccess }: UploadNoteButtonProps) {
  const { user } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has access to upload
  const hasAccess = user ? checkUserAccess(classroom, user.$id) : false;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error("You must be logged in to upload notes");
      return;
    }

    // Validate file type (images and PDFs only)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please select an image or PDF file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      await uploadNote(file, classroomId, user.$id);
      toast.success("Note uploaded successfully!");
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Call success callback to refresh the page
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error('Error uploading note:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload note. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    if (!hasAccess) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || !hasAccess}
      />
      
      <button
        onClick={handleButtonClick}
        disabled={uploading || !hasAccess}
        className="peer px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
        {uploading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </>
        )}
      </button>

      {/* Tooltip for users without access */}
      {!hasAccess && (
        <div className="invisible peer-hover:visible absolute left-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 transition-all pointer-events-none">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>Only admins and allowed members can upload notes</p>
          </div>
          {/* Arrow */}
          <div className="absolute left-6 -top-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
