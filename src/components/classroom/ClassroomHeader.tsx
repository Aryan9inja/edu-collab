import InviteLinkButton from "./InviteLinkButton";
import type { Classroom } from "@/services/classroom";

interface ClassroomHeaderProps {
  name: string;
  classroomId: string;
  classroom: Classroom;
}

export default function ClassroomHeader({ name, classroomId, classroom }: ClassroomHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            {name}
          </h1>
        </div>
        <InviteLinkButton classroomId={classroomId} classroom={classroom} />
      </div>
    </div>
  );
}
