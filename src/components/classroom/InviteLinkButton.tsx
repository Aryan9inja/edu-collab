"use client";

import { useState } from "react";
import { checkUserAccess } from "@/services/classroom";
import type { Classroom } from "@/services/classroom";
import { useAuthStore } from "@/stores/useAuthStore";

interface InviteLinkButtonProps {
  classroomId: string;
  classroom: Classroom;
}

export default function InviteLinkButton({ classroomId, classroom }: InviteLinkButtonProps) {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [showLink, setShowLink] = useState(false);

  // Check if user has access to share invite link
  const hasAccess = user ? checkUserAccess(classroom, user.$id) : false;

  const inviteUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/classrooms/join/${classroomId}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    if (!hasAccess) return;
    setShowLink(!showLink);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        disabled={!hasAccess}
        className="peer px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Invite Link
      </button>
      
      {/* Tooltip for users without access */}
      {!hasAccess && (
        <div className="invisible peer-hover:visible absolute left-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 transition-all pointer-events-none">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>Only admins and allowed members can share invite links</p>
          </div>
          {/* Arrow */}
          <div className="absolute left-6 -top-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}

      {showLink && hasAccess && (
        <div className="absolute top-full mt-2 right-0 z-10 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Share Invite Link</h3>
            <button
              onClick={() => setShowLink(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
            <p className="text-xs text-gray-600 break-all font-mono">{inviteUrl}</p>
          </div>

          <button
            onClick={handleCopyLink}
            className={`w-full px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Link
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Anyone with this link can join the classroom
          </p>
        </div>
      )}
    </div>
  );
}
