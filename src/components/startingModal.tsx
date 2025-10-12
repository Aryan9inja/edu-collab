import { FaChalkboardTeacher, FaUserGraduate, FaDoorOpen } from "react-icons/fa";

export default function StartingModal() {
  return (
    <div className="fixed z-50 p-10 border-2 shadow-2xl rounded-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white min-w-[350px] max-w-[90vw]">
      <h1 className="text-3xl text-center font-extrabold mb-8 text-blue-700 tracking-tight">
        Create or Join a Classroom
      </h1>
      <div className="flex gap-8 justify-center mb-6">
        <button className="flex flex-col items-center gap-2 bg-blue-500 text-white px-6 py-4 rounded-xl shadow-md hover:bg-blue-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300">
          <FaChalkboardTeacher className="text-3xl mb-1" />
          <span className="text-lg font-semibold">Create a classroom</span>
        </button>
        <button className="flex flex-col items-center gap-2 bg-green-500 text-white px-6 py-4 rounded-xl shadow-md hover:bg-green-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-300">
          <FaUserGraduate className="text-3xl mb-1" />
          <span className="text-lg font-semibold">Join a classroom</span>
        </button>
      </div>
      <div className="mt-6 flex flex-col items-center">
        <p className="text-center text-lg text-gray-700 mb-3 font-medium">
          Or join a demo classroom
        </p>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl shadow-md hover:bg-purple-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-300">
          <FaDoorOpen className="text-2xl" />
          <span className="text-lg font-semibold">Join Demo Classroom</span>
        </button>
      </div>
    </div>
  );
}
