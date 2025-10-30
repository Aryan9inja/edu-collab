"use client";

import { useEffect, useState } from "react";
import { getFileDownloadLink, getMetaData, getNote } from "@/services/notes";
import type { Classroom } from "@/services/classroom";
import DeleteNoteButton from "./DeleteNoteButton";

interface NoteCardProps {
  noteId: string;
  classroom?: Classroom;
  onDelete?: () => void;
}

export default function NoteCard({ noteId, classroom, onDelete }: NoteCardProps) {
  const [noteName, setNoteName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const meta = await getMetaData(noteId);
        setNoteName(meta.name || "Untitled Note");
      } catch (error) {
        console.error(`Error fetching metadata for note ${noteId}:`, error);
        setNoteName("Untitled Note");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [noteId]);

  const handleView = () => {
    const noteUrl = getNote(noteId);
    window.open(noteUrl, '_blank');
  };

  const handleDownload = () => {
    const downloadLink = getFileDownloadLink(noteId);
    window.open(downloadLink, '_blank');
  };

  return (
    <div className="group p-5 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:border-purple-300 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
            {loading ? (
              <span className="text-gray-400 animate-pulse">Loading...</span>
            ) : (
              noteName
            )}
          </h3>
          <p className="text-xs text-gray-500 font-mono">ID: {noteId.substring(0, 16)}...</p>
        </div>
        {classroom && (
          <DeleteNoteButton 
            noteId={noteId} 
            classroom={classroom} 
            onDeleteSuccess={onDelete}
          />
        )}
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={handleView}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </button>
        <button 
          onClick={handleDownload}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}
