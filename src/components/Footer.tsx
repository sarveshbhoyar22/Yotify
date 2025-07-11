import React from "react";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center text-slate-500">
          <p className="text-sm sm:text-base">
            Crafted with passion by{" "}
            <span className="text-purple-400 font-semibold">
              Sarvesh Bhoyar
            </span>
          </p>
          <p className="text-xs sm:text-sm mt-2">
            Experience music like never before — Premium streaming, zero
            interruptions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
