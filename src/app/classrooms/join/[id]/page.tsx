import { getClassroom } from "@/services/classroom";
import { notFound } from "next/navigation";
import JoinClassroomClient from "@/components/classroom/JoinClassroomClient";

interface JoinPageProps {
  params: { id: string };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { id } = params;

  // Fetch classroom data on the server to verify it exists
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

  return <JoinClassroomClient classroom={classroomData} />;
}

// Generate metadata
export async function generateMetadata({ params }: JoinPageProps) {
  const { id } = params;

  try {
    const classroom = await getClassroom(id);
    return {
      title: `Join ${classroom.name} | Edu Collab`,
      description: `You've been invited to join ${classroom.name}`,
    };
  } catch {
    return {
      title: "Join Classroom | Edu Collab",
      description: "Join a classroom",
    };
  }
}
