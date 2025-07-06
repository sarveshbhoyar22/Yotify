import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 mb-8">
      <div className="flex items-center space-x-3">
        <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-red-300 font-medium mb-1">Error</h3>
          <p className="text-red-200 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};