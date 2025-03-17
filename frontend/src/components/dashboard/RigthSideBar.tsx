import React from "react";

const RigthSideBar = () => {
  return (
    <div className="w-80 rounded-2xl bg-white dark:bg-gray-900 border-l dark:border-gray-800 h-full flex-shrink-0 flex flex-col items-center py-4 overflow-y-auto">
      <h3 className="text-lg font-medium mb-4">Properties</h3>
      {/* Add your right sidebar content here */}
      <div className="px-4 w-full">
        {/* Placeholder content */}
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md mb-3"></div>
        <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-md mb-3"></div>
        <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-md mb-3"></div>
      </div>
    </div>
  );
};

export default RigthSideBar;
