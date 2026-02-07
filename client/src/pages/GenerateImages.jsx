import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, FileImage } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

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
  const [publish, setPublish] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please describe the image");
      return;
    }

    try {
      setLoading(true);

      const prompt = `Generate an image of ${input} in ${selectedStyle} style`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
  if (!content) return;

  toast.success("Download started");


  const response = await fetch(content);
  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "image.png";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};




  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto text-gray-200">

      {/* LEFT — COMMAND PANEL */}
      <form
        onSubmit={onSubmitHandler}
        className="
          w-full lg:w-[380px]
          bg-[#111827]
          border border-white/10
          rounded-2xl p-5
        "
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-lg text-white">
            AI Image Generator
          </h2>
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
              bg-[#0B0F19]
              border border-white/10
              text-gray-200
              outline-none
              focus:ring-2 focus:ring-blue-500
              placeholder:text-gray-500
            "
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

        {/* Publish Toggle */}
        <div className="my-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          <p className="text-sm text-gray-300">
            Make this image public
          </p>
        </div>

        {/* Generate */}
        <button
          type="submit"
          disabled={loading}
          className="
            mt-6 w-full py-2.5
            rounded-xl text-sm font-medium
            flex items-center justify-center gap-2
            bg-gradient-to-r from-blue-500 to-indigo-500
            hover:opacity-90 transition
            disabled:opacity-50
          "
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              Generate Image
            </>
          )}
        </button>
      </form>

      {/* RIGHT — OUTPUT CANVAS */}
      <div
        className="
          flex-1
          bg-[#111827]
          border border-white/10
          rounded-2xl
          p-6
          flex flex-col
        "
      >
        <div className="flex items-center gap-2">
          <FileImage className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-lg text-white">
            Generated Image
          </h2>
        </div>

        {!content ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <FileImage className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-sm text-gray-400 max-w-xs">
              Describe an image and click{" "}
              <span className="text-white">Generate Image</span>.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
  <img
    src={content}
    alt="Processed"
    className="max-h-[420px] w-full object-contain rounded-lg"
  />

  <button
    disabled={loading}
    onClick={downloadImage}
    className="
      self-start px-4 py-2 text-xs rounded-lg
      bg-white/10 hover:bg-white/20 transition
      text-white disabled:opacity-50
    "
  >
    
    Download Image
  </button>
</div>

        )}
      </div>
    </div>
  );
};

export default GenerateImages;
