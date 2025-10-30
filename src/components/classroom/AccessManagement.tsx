"use client";

import { useState } from "react";
import { grantAccess, revokeAccess, checkUserAccess } from "@/services/classroom";
import type { Classroom } from "@/services/classroom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { FaUserShield, FaUserTimes, FaCheckCircle } from "react-icons/fa";

interface AccessManagementProps {
  classroom: Classroom;
  onAccessChange?: () => void;
}

export default function AccessManagement({ classroom, onAccessChange }: AccessManagementProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);

  if (!user) return null;

  const isAdmin = classroom.adminId === user.$id;
  const currentUserHasAccess = checkUserAccess(classroom, user.$id);

  // Only show to users with access
  if (!currentUserHasAccess) return null;

  const handleGrantAccess = async (userId: string) => {
    if (!user) return;

    setLoading(userId);
    try {
      await grantAccess(classroom.$id, userId, user.$id);
      toast.success("Access granted successfully");
      if (onAccessChange) onAccessChange();
    } catch (error) {
      console.error("Error granting access:", error);
      toast.error(error instanceof Error ? error.message : "Failed to grant access");
    } finally {
      setLoading(null);
    }
  };

  const handleRevokeAccess = async (userId: string) => {
    if (!user) return;

    setLoading(userId);
    try {
      await revokeAccess(classroom.$id, userId, user.$id);
      toast.success("Access revoked successfully");
      if (onAccessChange) onAccessChange();
    } catch (error) {
      console.error("Error revoking access:", error);
      toast.error(error instanceof Error ? error.message : "Failed to revoke access");
    } finally {
      setLoading(null);
    }
  };

  const members = classroom.users || [];
  const hasAccessList = classroom.hasAccess || [];

  // Filter out admin from the list (admin always has access)
  const managableMembers = members.filter(userId => userId !== classroom.adminId);

  if (managableMembers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <FaUserShield className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Access Management</h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {isAdmin 
          ? "Grant or revoke permission to upload notes and manage members"
          : "View members with editing permissions"}
      </p>

      <div className="space-y-3">
        {managableMembers.map((userId) => {
          const hasAccess = hasAccessList.includes(userId);
          const isProcessing = loading === userId;

          return (
            <div 
              key={userId} 
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div>
                  <p className="font-medium text-gray-700">User {userId.slice(0, 8)}...</p>
                  {hasAccess && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <FaCheckCircle className="w-3 h-3" />
                      Can edit
                    </div>
                  )}
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => hasAccess ? handleRevokeAccess(userId) : handleGrantAccess(userId)}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    hasAccess
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                      Processing...
                    </>
                  ) : hasAccess ? (
                    <>
                      <FaUserTimes className="w-4 h-4" />
                      Revoke Access
                    </>
                  ) : (
                    <>
                      <FaUserShield className="w-4 h-4" />
                      Grant Access
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Users with access can upload notes, delete notes, and add new members to the classroom.
          </p>
        </div>
      )}
    </div>
  );
}
