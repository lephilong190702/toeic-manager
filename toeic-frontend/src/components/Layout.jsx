import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="flex min-h-screen w-screen">
      {/* Sidebar cố định */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r z-50">
        <Sidebar />
      </aside>

      {/* Nội dung chính dịch sang phải để không bị che */}
      <main className="ml-64 flex-1 bg-gradient-to-br from-blue-950 to-gray-900 overflow-y-auto px-6 pt-0 pb-6 min-h-screen">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
