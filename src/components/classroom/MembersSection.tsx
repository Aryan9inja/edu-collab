"use client";

import { useEffect, useState } from "react";
import { getUsernames, searchUsersByUsername } from "@/services/users";
import { grantAccess, revokeAccess } from "@/services/classroom";
import type { Classroom } from "@/services/classroom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { FaUserShield, FaUserTimes, FaCheckCircle, FaCrown, FaSearch } from "react-icons/fa";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isAdmin = user && classroom.adminId === user.$id;
  const hasAccessList = classroom.hasAccess || [];
  const canManageAccess = isAdmin || (user && hasAccessList.includes(user.$id));
  const currentUserHasAccess = user && (isAdmin || hasAccessList.includes(user.$id));

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

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Search within classroom members only
        const results = await searchUsersByUsername(searchQuery, userIds);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
        toast.error("Failed to search users");
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, userIds]);

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
      // Clear search after successful toggle
      setSearchQuery("");
      setSearchResults([]);
      if (onAccessChange) onAccessChange();
    } catch (error) {
      console.error("Error toggling access:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update access");
    } finally {
      setProcessingUserId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h2 className="text-lg font-bold text-gray-800">Members</h2>
      </div>

      {canManageAccess && (
        <>
          <div className="mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 flex items-center gap-1.5">
              <FaUserShield className="w-3.5 h-3.5" />
              <span>Search members to manage access</span>
            </p>
          </div>

          {/* Search Input */}
          <div className="mb-3 relative">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search username..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="animate-spin h-3.5 w-3.5 text-blue-600" viewBox="0 0 24 24">
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
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                {isSearching ? (
                  <div className="p-3 text-center text-gray-500 text-xs">
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-3 text-center text-gray-500 text-xs">
                    No users found
                  </div>
                ) : (
                  <div className="py-1">
                    <div className="px-3 py-1.5 text-xs text-gray-500 font-medium bg-gray-50">
                      {searchResults.length} member{searchResults.length !== 1 ? 's' : ''} (max 10)
                    </div>
                    {searchResults.map((result) => {
                      const isProcessing = processingUserId === result.id;
                      const isUserAdmin = result.id === classroom.adminId;
                      const userHasAccess = hasAccessList.includes(result.id);
                      
                      return (
                        <div
                          key={result.id}
                          className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors border-t border-gray-100 first:border-t-0"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs relative">
                              {result.name.charAt(0).toUpperCase()}
                              {isUserAdmin && (
                                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <FaCrown className="w-2 h-2 text-yellow-900" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-gray-700">
                                  {result.name}
                                </span>
                                {isUserAdmin && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-semibold">
                                    Admin
                                  </span>
                                )}
                              </div>
                              {userHasAccess && !isUserAdmin && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <FaCheckCircle className="w-2.5 h-2.5" />
                                  Has access
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Only show toggle for non-admin users */}
                          {!isUserAdmin && (
                            <button
                              onClick={() => handleToggleAccess(result.id, userHasAccess)}
                              disabled={isProcessing}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${
                                userHasAccess
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
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
                              ) : userHasAccess ? (
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
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="space-y-2">
        {loading ? (
          <p className="text-gray-400 text-sm animate-pulse">Loading members...</p>
        ) : usernames.length === 0 ? (
          <p className="text-gray-400 text-sm">No members yet</p>
        ) : (
          usernames
            .filter((userData) => {
              // If user has access, show all members
              if (currentUserHasAccess) return true;
              // If user doesn't have access, only show admin
              return userData.id === classroom.adminId;
            })
            .slice(0, 5) // Limit to first 5 members
            .map((userData) => {
            const userId = userData.id;
            const username = userData.name || userData.id;
            const isUserAdmin = userId === classroom.adminId;
            const hasAccess = hasAccessList.includes(userId);
            const isProcessing = processingUserId === userId;

            return (
                <div 
                key={userId} 
                className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-gradient-to-r from-blue-50/50 to-sky-50/50 border border-blue-100 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm relative flex-shrink-0">
                    {username.charAt(0).toUpperCase()}
                    {isUserAdmin && (
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <FaCrown className="w-2.5 h-2.5 text-yellow-900" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-gray-700 text-sm truncate">{username}</span>
                      {isUserAdmin && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                          Admin
                        </span>
                      )}
                    </div>
                    {hasAccess && !isUserAdmin && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                        <FaCheckCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">Can upload & manage</span>
                        <span className="sm:hidden">Access</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Access Toggle - Only shown to admin and not for admin user */}
                {isAdmin && !isUserAdmin && (
                  <button
                    onClick={() => handleToggleAccess(userId, hasAccess)}
                    disabled={isProcessing}
                    className={`px-2.5 py-1.5 rounded-lg font-medium text-xs transition-all flex items-center gap-1 flex-shrink-0 ${
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
          {currentUserHasAccess && usernames.length > 5 ? (
            <>
              Showing <span className="font-semibold text-gray-700">5</span> of{" "}
              <span className="font-semibold text-gray-700">{usernames.length}</span> members
              <span className="block text-xs text-gray-400 mt-1">Use search to find others</span>
            </>
          ) : (
            <>
              Total: <span className="font-semibold text-gray-700">{usernames.length}</span> {usernames.length === 1 ? 'member' : 'members'}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
