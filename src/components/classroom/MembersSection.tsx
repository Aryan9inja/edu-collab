"use client";

import { useEffect, useState } from "react";
import { getUsernames } from "@/services/users";

interface MembersSectionProps {
  userIds: string[];
}

export default function MembersSection({ userIds }: MembersSectionProps) {
  const [usernames, setUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsernames = async () => {
      if (userIds && userIds.length > 0) {
        try {
          const usernameData = await getUsernames(userIds);
          setUsernames(usernameData.map((u) => u.name || u.id));
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800">Members</h2>
      </div>
      
      <div className="space-y-2">
        {loading ? (
          <p className="text-gray-400 text-sm animate-pulse">Loading members...</p>
        ) : usernames.length === 0 ? (
          <p className="text-gray-400 text-sm">No members yet</p>
        ) : (
          usernames.map((username) => (
            <div 
              key={username} 
              className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700">{username}</span>
            </div>
          ))
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
