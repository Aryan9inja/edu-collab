"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Classroom } from "@/services/classroom";
import ClassroomHeader from "./ClassroomHeader";
import MembersSection from "./MembersSection";
import NotesSection from "./NotesSection";
import UploadNoteButton from "./UploadNoteButton";

interface ClassroomContentProps {
  classroom: Classroom;
}

export default function ClassroomContent({ classroom }: ClassroomContentProps) {
  const router = useRouter();
  const [key, setKey] = useState(0);

  const handleUploadSuccess = () => {
    // Refresh the page data
    router.refresh();
    // Force re-render of notes section
    setKey(prev => prev + 1);
  };

  const handleAccessChange = () => {
    // Refresh the page data when access is granted/revoked
    router.refresh();
    setKey(prev => prev + 1);
  };

  const handleNoteDelete = () => {
    // Refresh when a note is deleted
    router.refresh();
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <ClassroomHeader name={classroom.name} classroomId={classroom.$id} classroom={classroom} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Members Section */}
          <div className="lg:col-span-1">
            <MembersSection 
              userIds={classroom.users || []} 
              classroom={classroom}
              onAccessChange={handleAccessChange}
            />
          </div>

          {/* Notes Section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <UploadNoteButton 
                classroomId={classroom.$id}
                classroom={classroom}
                onUploadSuccess={handleUploadSuccess}
              />
            </div>
            <NotesSection 
              key={key} 
              noteIds={classroom.notes || []} 
              classroom={classroom}
              onNoteDelete={handleNoteDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
