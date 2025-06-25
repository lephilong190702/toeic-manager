import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { MenuIcon } from "lucide-react";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-screen bg-gray-100 relative">
      {/* Overlay chỉ hiện trên mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`z-50 bg-white border-r shadow-lg transform transition-transform duration-300
    fixed top-0 left-0 w-64 h-screen overflow-y-auto overflow-x-hidden
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:h-auto md:sticky md:top-0
  `}
      >

        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-white shadow px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-700 hover:text-blue-700"
          >
            <MenuIcon size={24} />
          </button>

          {!sidebarOpen && (
            <h1 className="text-xl font-bold text-blue-800 md:hidden">
              🧠 TOEIC Vocabulary Manager
            </h1>
          )}
        </div>

        <div className="px-6 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
