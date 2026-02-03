import { Edit, Sparkles, FileText } from "lucide-react";
import React, { useState } from "react";

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short" },
    { length: 1200, text: "Medium" },
    { length: 1600, text: "Long" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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
          <h2 className="font-semibold text-lg">Generate Article</h2>
        </div>

        {/* Topic */}
        <div className="mt-6">
          <label className="text-xs text-gray-400 uppercase">
            Topic
          </label>
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="The future of artificial intelligence..."
            className="
              mt-2 w-full resize-none
              rounded-lg px-3 py-2 text-sm
              bg-black/30 border border-white/10
              outline-none focus:border-blue-500
            "
            required
          />
        </div>

        {/* Length */}
        <div className="mt-5">
          <label className="text-xs text-gray-400 uppercase">
            Length
          </label>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {articleLength.map((item) => (
              <button
                key={item.length}
                type="button"
                onClick={() => setSelectedLength(item)}
                className={`
                  py-2 rounded-lg text-xs font-medium transition
                  ${
                    selectedLength.length === item.length
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }
                `}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        {/* Action */}
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
          <Edit className="w-4 h-4" />
          Generate
        </button>
      </form>

      {/* RIGHT — CANVAS */}
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
          <FileText className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-lg">Output</h2>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <FileText className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-sm text-gray-400 max-w-xs">
            Your generated article will appear here once you click
            <span className="text-white"> Generate</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
