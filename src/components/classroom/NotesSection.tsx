"use client";

import NoteCard from "./NoteCard";
import type { Classroom } from "@/services/classroom";

interface NotesSectionProps {
  noteIds: string[];
  classroom?: Classroom;
  onNoteDelete?: () => void;
}

export default function NotesSection({ noteIds, classroom, onNoteDelete }: NotesSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-800">Notes</h2>
        </div>
        <span className="px-2.5 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
          {noteIds.length}
        </span>
      </div>

      <div className="space-y-3">
        {noteIds.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-400 mb-1">No notes available</h3>
            <p className="text-xs text-gray-400">Notes will appear here once they are added</p>
          </div>
        ) : (
          noteIds.map((noteId) => (
            <NoteCard 
              key={noteId} 
              noteId={noteId} 
              classroom={classroom}
              onDelete={onNoteDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
