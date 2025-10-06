"use client";
import { authService } from "@/services/auth";
import { toast } from "sonner";

export default function Home(){
    const handleLogout = async () => {
        try {
            await authService.logoutUser();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error logging out");
            console.error(error);
            return;
        }
    };
    return <button onClick={handleLogout}>Click me</button>;
}