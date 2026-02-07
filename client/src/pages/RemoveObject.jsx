import React, { useState } from "react";
import { Scissors, Sparkles, FileImage } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please describe what you want to remove");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", prompt); // 🔥 full sentence

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
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

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto text-gray-200">
      {/* LEFT */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-[400px] bg-[#111827] border border-white/10 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-red-400" />
          <h2 className="font-semibold text-lg text-white">
            Object Removal
          </h2>
        </div>

        <div className="mt-6">
          <label className="text-xs text-gray-400 uppercase">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2 w-full rounded-lg px-3 py-2 text-sm bg-[#0B0F19] border border-white/10 text-gray-300"
          />
        </div>

        <div className="mt-5">
          <label className="text-xs text-gray-400 uppercase">
            What should be removed?
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. remove the car from the background"
            className="mt-2 w-full resize-none rounded-lg px-3 py-2 text-sm bg-[#0B0F19] border border-white/10 text-gray-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Scissors className="w-4 h-4" />
              Remove Object
            </>
          )}
        </button>
      </form>

      {/* RIGHT */}
      <div className="flex-1 bg-[#111827] border border-white/10 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center gap-2">
          <FileImage className="w-5 h-5 text-red-400" />
          <h2 className="font-semibold text-lg text-white">
            Processed Image
          </h2>
        </div>

        {!content ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <Scissors className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-sm text-gray-400 max-w-xs">
              Upload an image and describe what to remove.
            </p>
          </div>
        ) : (
          <img
            src={content}
            alt="Processed"
            className="mt-4 max-h-[420px] w-full object-contain rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
