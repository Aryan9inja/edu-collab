import InviteLinkButton from "./InviteLinkButton";

interface ClassroomHeaderProps {
  name: string;
  classroomId: string;
}

export default function ClassroomHeader({ name, classroomId }: ClassroomHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {name}
          </h1>
          <p className="text-gray-500">Classroom ID: {classroomId}</p>
        </div>
        <InviteLinkButton classroomId={classroomId} />
      </div>
    </div>
  );
}
