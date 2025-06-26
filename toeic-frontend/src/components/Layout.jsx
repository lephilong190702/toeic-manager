import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { MenuIcon } from "lucide-react";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen w-screen bg-gray-100 relative font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`z-50 bg-white border-r shadow-xl transform transition-transform duration-300
        fixed top-0 left-0 w-64 h-screen overflow-y-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:h-auto md:sticky md:top-0 rounded-r-2xl`}
      >
        <Sidebar
          closeSidebar={() => setSidebarOpen(false)}
          onLogin={() => {
            setShowLogin(true);
            setShowRegister(false);
          }}
          onRegister={() => {
            setShowRegister(true);
            setShowLogin(false);
          }}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto relative">
        <div className="bg-white/80 backdrop-blur-sm shadow-md px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-700 hover:text-blue-700"
          >
            <MenuIcon size={24} />
          </button>
          <h1 className="text-xl font-bold text-blue-800 md:hidden">
            🧠 TOEIC Vocabulary Manager
          </h1>
        </div>

        <div className="px-6 py-4">
          <Outlet />
        </div>

        {showLogin || showRegister ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fadeIn">
              {showLogin && (
                <LoginForm
                  onClose={() => setShowLogin(false)}
                  onSwitch={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                />
              )}
              {showRegister && (
                <RegisterForm
                  onClose={() => setShowRegister(false)}
                  onSwitch={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                />
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default Layout;
