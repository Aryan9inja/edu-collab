import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <svg 
            className="w-32 h-32 mx-auto text-gray-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Classroom Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The classroom you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/classrooms"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Back to Classrooms
          </Link>
          
          <Link 
            href="/"
            className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
