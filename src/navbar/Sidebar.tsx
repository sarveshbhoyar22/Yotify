import React from "react";
import { Home, Search, Library } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-40 transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:block`}
    >
      <div className="p-6 border-b border-gray-700 flex items-center justify-between md:hidden">
        <h2 className="text-lg font-bold text-white">Menu</h2>
        <button onClick={onClose} className="text-white">
          &times;
        </button>
      </div>

      <nav className="p-6 space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded hover:bg-gray-800 ${
              isActive ? "bg-gray-800 text-purple-400" : "text-white"
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded hover:bg-gray-800 ${
              isActive ? "bg-gray-800 text-purple-400" : "text-white"
            }`
          }
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </NavLink>

        <div className="flex items-center space-x-3 p-2 text-gray-500 cursor-not-allowed">
          <Library className="h-5 w-5" />
          <span>Your Library</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
