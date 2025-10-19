"use client";
import { useAuthStore } from "@/stores/useAuthStore";

export const LogoutButton = () => {
    const {loading, logout} = useAuthStore();
  const handleLogout = () => {
    logout();
  };
    if (loading) {
      return <button className="p-2 bg-red-500 text-white rounded" disabled>Loading...</button>;
    }

  return <button className="p-2 bg-red-500 text-white rounded" onClick={handleLogout}>Logout</button>;
};
