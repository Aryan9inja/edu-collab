"use client";

import { useEffect, useState } from "react";
import { getUsernames } from "@/services/users";
import { grantAccess, revokeAccess } from "@/services/classroom";
import type { Classroom } from "@/services/classroom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { FaUserShield, FaUserTimes, FaCheckCircle, FaCrown } from "react-icons/fa";

interface MembersSectionProps {
  userIds: string[];
  classroom: Classroom;
  onAccessChange?: () => void;
}

export default function MembersSection({ userIds, classroom, onAccessChange }: MembersSectionProps) {
  const { user } = useAuthStore();
  const [usernames, setUsernames] = useState<{ id: string; name?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  const isAdmin = user && classroom.adminId === user.$id;
  const hasAccessList = classroom.hasAccess || [];

  useEffect(() => {
    const fetchUsernames = async () => {
      if (userIds && userIds.length > 0) {
        try {
          const usernameData = await getUsernames(userIds);
          setUsernames(usernameData);
        } catch (error) {
          console.error("Error fetching usernames:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUsernames();
  }, [userIds]);

  const handleToggleAccess = async (userId: string, currentlyHasAccess: boolean) => {
    if (!user) return;

    setProcessingUserId(userId);
    try {
      if (currentlyHasAccess) {
        await revokeAccess(classroom.$id, userId, user.$id);
        toast.success("Access revoked");
      } else {
        await grantAccess(classroom.$id, userId, user.$id);
        toast.success("Access granted");
      }
      if (onAccessChange) onAccessChange();
    } catch (error) {
      console.error("Error toggling access:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update access");
    } finally {
      setProcessingUserId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800">Members</h2>
      </div>

      {isAdmin && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 flex items-center gap-2">
            <FaUserShield className="w-4 h-4" />
            <span>Click the toggle to grant/revoke upload permissions</span>
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        {loading ? (
          <p className="text-gray-400 text-sm animate-pulse">Loading members...</p>
        ) : usernames.length === 0 ? (
          <p className="text-gray-400 text-sm">No members yet</p>
        ) : (
          usernames.map((userData) => {
            const userId = userData.id;
            const username = userData.name || userData.id;
            const isUserAdmin = userId === classroom.adminId;
            const hasAccess = hasAccessList.includes(userId);
            const isProcessing = processingUserId === userId;

            return (
              <div 
                key={userId} 
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold relative">
                    {username.charAt(0).toUpperCase()}
                    {isUserAdmin && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <FaCrown className="w-3 h-3 text-yellow-900" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">{username}</span>
                      {isUserAdmin && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                          Admin
                        </span>
                      )}
                    </div>
                    {hasAccess && !isUserAdmin && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                        <FaCheckCircle className="w-3 h-3" />
                        Can upload & manage
                      </div>
                    )}
                  </div>
                </div>

                {/* Access Toggle - Only shown to admin and not for admin user */}
                {isAdmin && !isUserAdmin && (
                  <button
                    onClick={() => handleToggleAccess(userId, hasAccess)}
                    disabled={isProcessing}
                    className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all flex items-center gap-1.5 ${
                      hasAccess
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={hasAccess ? "Click to revoke access" : "Click to grant access"}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
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
                        <span>...</span>
                      </>
                    ) : hasAccess ? (
                      <>
                        <FaUserTimes className="w-3 h-3" />
                        <span>Revoke</span>
                      </>
                    ) : (
                      <>
                        <FaUserShield className="w-3 h-3" />
                        <span>Grant</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-700">{usernames.length}</span> {usernames.length === 1 ? 'member' : 'members'}
        </p>
      </div>
    </div>
  );
}
