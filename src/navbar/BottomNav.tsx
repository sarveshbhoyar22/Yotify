import React from "react";
import { Home, Search, Library } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around items-center h-16 md:hidden z-40">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${
            isActive ? "text-purple-400" : "text-gray-400"
          }`
        }
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${
            isActive ? "text-purple-400" : "text-gray-400"
          }`
        }
      >
        <Search className="h-5 w-5" />
        <span>Search</span>
      </NavLink>
      <div className="flex flex-col items-center text-xs text-gray-500">
        <Library className="h-5 w-5" />
        <span>Library</span>
      </div>
    </nav>
  );
};

export default BottomNav;
