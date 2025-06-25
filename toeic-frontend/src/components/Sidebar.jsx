import { NavLink } from "react-router-dom";
import {
  BookOpenIcon,
  SparklesIcon,
  BarChartIcon,
  BrainIcon
} from "lucide-react";

function Sidebar() {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition";

  const activeClass = "bg-blue-100 text-blue-700";

  return (
    <nav className="h-full flex flex-col p-4 space-y-2">
      <h2 className="text-xl font-bold text-blue-800 mb-4">🧠 TOEIC Vocab</h2>

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <SparklesIcon size={20} />
        Learning
      </NavLink>

      <NavLink
        to="/new"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <BrainIcon size={20} />
        New Words
      </NavLink>

      <NavLink
        to="/review"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <BookOpenIcon size={20} />
        Review
      </NavLink>

      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <BarChartIcon size={20} />
        Statistics
      </NavLink>


    </nav>
  );
}

export default Sidebar;
