import { getClassroom } from "@/services/classroom";
import { notFound } from "next/navigation";
import ClassroomContent from "@/components/classroom/ClassroomContent";

interface ClassroomPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassroomPage({ params }: ClassroomPageProps) {
  const { id } = await params;

  // Fetch classroom data on the server
  let classroomData;
  try {
    classroomData = await getClassroom(id);
  } catch (error) {
    console.error("Error fetching classroom:", error);
    notFound();
  }

  if (!classroomData) {
    notFound();
  }

  return <ClassroomContent classroom={classroomData} />;
}

// Optional: Generate metadata for better SEO
export async function generateMetadata({ params }: ClassroomPageProps) {
  const { id } = await params;

  try {
    const classroom = await getClassroom(id);
    return {
      title: `${classroom.name} | Edu Collab`,
      description: `View and manage notes for ${classroom.name}`,
    };
  } catch {
    return {
      title: "Classroom | Edu Collab",
      description: "View classroom details",
    };
  }
}
