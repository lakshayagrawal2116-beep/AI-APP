import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
         min-h-screen
    flex
    items-center
    justify-center
    relative

      "
    >
      <div style={{color:"white"}} className="max-w-3xl text-center px-6 z-10">
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
          Create amazing content with AI tools
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images, and enhance your workflow.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button onClick={() => navigate("/ai")}
            className="
              px-6 py-3
              bg-white
              text-black
              rounded-full
              font-semibold
              hover:scale-105
              transition
            "
          >
            Get Started
          </button>

          <button
            
            className="
              px-6 py-3
              border border-white/30
              rounded-full
              hover:bg-white/10
              transition
            "
          >
            Learn More
          </button>
        </div>

        {/* Trusted users */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-300 text-sm">
          <img
            src={assets.user_group}
            alt="Users"
            className="h-8"
          />
          <span>Trusted by 10k+ people</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
