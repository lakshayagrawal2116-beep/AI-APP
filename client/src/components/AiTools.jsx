import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClick = (path) => {
    if (!user) {
      navigate("/sign-in");
    } else {
      navigate(path);
    }
  };

  return (
    // 🔴 IMPORTANT FIX IS HERE
    <section className="relative isolate z-10 overflow-hidden px-4 sm:px-20 xl:px-32 py-24">
      <div className="text-center">
        <h2 className="text-white text-[42px] font-semibold">
          Powerful AI tools
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      <div className="flex flex-wrap mt-14 justify-center">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            onClick={() => handleClick(tool.path)}
            className="
              p-8 m-4 max-w-xs rounded-xl
              bg-white
              shadow-xl
              border border-gray-200
              hover:-translate-y-1
              transition-all duration-300
              cursor-pointer
              relative
            "
          >
            <tool.Icon
              className="w-12 h-12 p-3 text-white rounded-xl"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            />

            <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-900">
              {tool.title}
            </h3>

            <p className="text-gray-500 text-sm max-w-[95%]">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AiTools;
