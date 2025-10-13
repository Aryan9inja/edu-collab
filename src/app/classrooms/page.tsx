import ClassroomList from "@/components/classroomList";

export default function Classrooms() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4 overflow-hidden">
      <div className="w-full max-w-2xl h-[calc(100vh-2rem)] bg-white rounded-lg shadow-md p-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 flex-shrink-0">Classrooms</h1>
        <ClassroomList />
      </div>
    </main>
  );
}
