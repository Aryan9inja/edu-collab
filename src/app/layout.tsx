import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "EduCollab",
  description: "A collaborative studying platform for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        {children}
      </body>
    </html>
  );
}
