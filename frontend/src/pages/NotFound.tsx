import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <FileText className="w-24 h-24 text-red-600 mx-auto mb-6 opacity-50" />
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 border border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;