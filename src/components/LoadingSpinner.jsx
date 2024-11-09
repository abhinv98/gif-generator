import React from "react";

const LoadingSpinner = ({ message = "Generating GIF...", substatus = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 rounded-full animate-spin-slow border-t-transparent"></div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <p className="text-gray-600 text-sm">{message}</p>
        {substatus && (
          <p className="text-xs text-gray-500">{substatus}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;