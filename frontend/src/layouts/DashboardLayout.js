// import React from "react";
// import Sidebar from "../components/Sidebar";

// const DashboardLayout = ({ children }) => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="p-6 w-full bg-gray-100 min-h-screen">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import React from "react";
import Sidebar from "../components/Sidebar"; // Make sure the path to your Sidebar file is correct

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* The Sidebar is fixed, so it doesn't take up space in the flex flow */}
      <Sidebar />

      {/* Main Content Area 
          ml-72: Adds left margin to prevent content from going under the fixed sidebar (w-72)
      */}
      <main className="flex-1 ml-72 p-8 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// CRITICAL: This line fixes the "export 'default' was not found" error
export default DashboardLayout;