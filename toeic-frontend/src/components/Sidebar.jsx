import { NavLink } from "react-router-dom";
import {
  BookOpenIcon,
  SparklesIcon,
  BarChartIcon,
  BrainIcon,
  XIcon,
  LogInIcon,
  LogOutIcon,
  UserPlusIcon,
  UserIcon,
} from "lucide-react";

function Sidebar({ closeSidebar, onLogin, onRegister, onLogout }) {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-100 hover:text-blue-800 rounded-xl font-medium transition";
  const activeClass = "bg-blue-200 text-blue-900 font-semibold";

  const username = localStorage.getItem("username");

  return (
    <nav className="h-full flex flex-col p-6 space-y-3 w-64 bg-gradient-to-b from-blue-50 to-white shadow-sm rounded-r-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-blue-800 tracking-tight">🧠 TOEIC Vocab</h2>
        <button
          className="text-gray-400 hover:text-red-500 transition md:hidden"
          onClick={closeSidebar}
        >
          <XIcon size={20} />
        </button>
      </div>

      <NavLink to="/" end className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
        <SparklesIcon size={20} />
        Learning
      </NavLink>

      <NavLink to="/new" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
        <BrainIcon size={20} />
        New Words
      </NavLink>

      <NavLink to="/review" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
        <BookOpenIcon size={20} />
        Review
      </NavLink>

      <NavLink to="/stats" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
        <BarChartIcon size={20} />
        Statistics
      </NavLink>

      <hr className="my-3 border-gray-300" />

      {username?.trim() && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-100 rounded-xl mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <UserIcon size={20} />
          </div>
          <div className="text-sm font-medium text-blue-800 truncate">
            👋 Hello, <span className="font-semibold">{username}</span>
          </div>
        </div>
      )}

      {!username ? (
        <>
          <button onClick={onLogin} className={linkClass}>
            <LogInIcon size={20} />
            Login
          </button>
          <button onClick={onRegister} className={linkClass}>
            <UserPlusIcon size={20} />
            Register
          </button>
        </>
      ) : (
        <button onClick={onLogout} className={`${linkClass} text-red-600 hover:bg-red-100 hover:text-red-700`}>
          <LogOutIcon size={20} />
          Logout
        </button>
      )}
    </nav>
  );
}

export default Sidebar;
