import React, { useState } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <header className="flex items-center justify-between p-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Yotify</h1>
        </header>

        <main className="p-4 pb-20">{children}</main>
      </div>

      {/* Bottom Navigation on Mobile */}
      <BottomNav />
    </div>
  );
};

export default Layout;
