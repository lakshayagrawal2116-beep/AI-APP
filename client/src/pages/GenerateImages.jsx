import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, FileImage } from "lucide-react";

const GenerateImages = () => {
  const imageStyles = [
    "Realistic",
    "Ghibli Style",
    "Anime Style",
    "Cartoon Style",
    "Fantasy Style",
    "3D Style",
    "Portrait Style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // image generation logic later
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">

      {/* LEFT — COMMAND PANEL */}
      <form
        onSubmit={onSubmitHandler}
        className="
          w-full lg:w-[380px]
          bg-white/5 backdrop-blur-md
          border border-white/10
          rounded-2xl p-5
          text-white
        "
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-lg">AI Image Generator</h2>
        </div>

        {/* Prompt */}
        <div className="mt-6">
          <label className="text-xs text-gray-400 uppercase">
            Describe your image
          </label>
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="A futuristic city at sunset with flying cars..."
            className="
              mt-2 w-full resize-none
              rounded-lg px-3 py-2 text-sm
              bg-black/30 border border-white/10
              outline-none focus:border-blue-500
            "
            required
          />
        </div>

        {/* Style */}
        <div className="mt-5">
          <label className="text-xs text-gray-400 uppercase">
            Style
          </label>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {imageStyles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setSelectedStyle(style)}
                className={`
                  py-2 rounded-lg text-xs font-medium transition
                  ${
                    selectedStyle === style
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }
                `}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button
          type="submit"
          className="
            mt-6 w-full py-2.5
            rounded-xl text-sm font-medium
            flex items-center justify-center gap-2
            bg-gradient-to-r from-blue-500 to-indigo-500
            hover:opacity-90 transition
          "
        >
          <ImageIcon className="w-4 h-4" />
          Generate Image
        </button>
      </form>

      {/* RIGHT — OUTPUT CANVAS */}
      <div
        className="
          flex-1
          bg-white/5 backdrop-blur-md
          border border-white/10
          rounded-2xl
          p-6
          text-white
          flex flex-col
        "
      >
        <div className="flex items-center gap-2">
          <FileImage className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-lg">Generated Image</h2>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <FileImage className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-sm text-gray-400 max-w-xs">
            Describe an image and click{" "}
            <span className="text-white">Generate Image</span> to see results
            here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
