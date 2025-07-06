import React from "react";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 px-6 py-6 border-t border-gray-700 bg-gray-900 text-center text-sm text-gray-400">
      <div className="flex items-center justify-center gap-2">
        <span>Made with</span>
        <Heart className="text-red-500 fill-red-500 h-4 w-4" />
        <span>by Sarvesh Bhoyar</span>
      </div>
    </footer>
  );
};

export default Footer;
