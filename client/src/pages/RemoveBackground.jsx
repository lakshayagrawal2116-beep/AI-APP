import React, { useState } from "react";
import { Eraser, Sparkles, FileImage } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "multipart/form-data",
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
            Background Removal
          </h2>
        </div>

        {/* Upload */}
        <div className="mt-6">
          <label className="text-xs text-gray-400 uppercase">
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="
              mt-2 w-full
              rounded-lg px-3 py-2 text-sm
              bg-[#0B0F19]
              border border-white/10
              text-gray-300
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
          />

          <p className="text-xs text-gray-500 font-light mt-1">
            Supports JPG, PNG, WEBP
          </p>
        </div>

        {/* Action */}
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
              <Eraser className="w-4 h-4" />
              Remove Background
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
            Output Image
          </h2>
        </div>

        {!content ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <FileImage className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-sm text-gray-400 max-w-xs">
              Upload an image and click{" "}
              <span className="text-white">Remove Background</span>
              <br />
              to see the result here.
            </p>
          </div>
        ) : (
          <img
            src={content}
            alt="Removed background"
            className="mt-4 max-h-[420px] w-full object-contain rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
