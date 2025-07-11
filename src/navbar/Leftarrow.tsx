import { MoveLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Leftarrow = () => {
  const navigate = useNavigate();
  return (
    <div>
      <span
        className="flex items-center  justify-between mb-2 bg-gradient-to-l from-purple-400 to-blue-400 h-5 w-5 rounded-full p-1"
        onClick={() => navigate(-1)}
      >
        <MoveLeft className=" text-white text-extra-bold h-8 w-8 cursor-pointer" />
      </span>
    </div>
  );
};

export default Leftarrow;
