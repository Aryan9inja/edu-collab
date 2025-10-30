"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { createUsername, checkUsernameExists } from "@/services/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FaUser, FaCheck } from "react-icons/fa";

export default function UsernameSetup() {
  const router = useRouter();
  const { user, setUserHasUsername } = useAuthStore();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const validateUsername = (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return "Username is required";
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length < 3) {
      return "Username must be at least 3 characters";
    }

    if (trimmedValue.length > 20) {
      return "Username must be less than 20 characters";
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedValue)) {
      return "Username can only contain letters, numbers, underscores, and hyphens";
    }

    return null;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    const validationError = validateUsername(value);
    if (validationError) {
      setError(validationError);
    } else {
      setError("");
    }
  };

  const checkAvailability = async () => {
    if (!username.trim()) return;

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setChecking(true);
    try {
      const exists = await checkUsernameExists(username.trim());
      if (exists) {
        setError("Username is already taken");
      } else {
        setError("");
        toast.success("Username is available!");
      }
    } catch (error) {
      console.error("Error checking username:", error);
      toast.error("Failed to check username availability");
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not found. Please log in again.");
      router.push("/auth/login");
      return;
    }

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // Check if username is available before creating
      const exists = await checkUsernameExists(username.trim());
      if (exists) {
        setError("Username is already taken");
        setLoading(false);
        return;
      }

      await createUsername(user.$id, username.trim());
      setUserHasUsername(true);
      toast.success("Username created successfully!");
      router.push("/classrooms");
    } catch (error) {
      console.error("Error creating username:", error);
      if (error instanceof Error) {
        toast.error(error.message);
        setError(error.message);
      } else {
        toast.error("Failed to create username");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUser className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Choose Your Username
          </h1>
          <p className="text-gray-600">
            Create a unique username for your EduCollab account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="johndoe_123"
                value={username}
                onChange={handleUsernameChange}
                className={`pr-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${error ? "border-red-500 focus:border-red-500" : ""}`}
                disabled={loading}
              />
              <Button
                type="button"
                onClick={checkAvailability}
                disabled={!username.trim() || !!error || checking || loading}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                variant="outline"
              >
                {checking ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                  >
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
                ) : (
                  "Check"
                )}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <p className="text-gray-500 text-sm">
              3-20 characters. Letters, numbers, underscores, and hyphens only.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || checking || !!error || !username.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                >
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
                Creating...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Continue to EduCollab
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You can change your username later in settings
          </p>
        </div>
      </div>
    </div>
  );
}
