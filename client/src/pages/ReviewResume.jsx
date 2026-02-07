import React, { useState } from "react";
import { Sparkles, FileText, Upload } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import jsPDF from "jspdf";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post(
        "/api/ai/review-resume",
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

  const downloadPDF = () => {
  if (!content) {
    toast.error("Nothing to download");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");

  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  const marginX = 20;
  let cursorY = 20;

  doc.setFont("Times", "Normal");
  doc.setFontSize(12);

  // Title
  doc.setFontSize(16);
  doc.text("AI Resume Review Report", marginX, cursorY);
  cursorY += 10;

  doc.setFontSize(12);

  const lines = doc.splitTextToSize(
    content,
    pageWidth - marginX * 2
  );

  lines.forEach((line) => {
    if (cursorY > pageHeight - 20) {
      doc.addPage();
      cursorY = 20;
    }
    doc.text(line, marginX, cursorY);
    cursorY += 7;
  });

  doc.save("resume-review.pdf");
};

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto text-gray-200">

      {/* LEFT — RESUME REVIEW PANEL */}
      <form
        onSubmit={onSubmitHandler}
        className="
          w-full lg:w-[400px]
          bg-[#111827]
          border border-white/10
          rounded-2xl p-5
        "
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="font-semibold text-lg text-white">
            Resume Review
          </h2>
        </div>

        {/* Upload */}
        <div className="mt-6">
          <label className="text-xs text-gray-400 uppercase">
            Upload Resume
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="
              mt-2 w-full
              rounded-lg px-3 py-2 text-sm
              bg-[#0B0F19]
              border border-white/10
              text-gray-300
              outline-none
              focus:ring-2 focus:ring-emerald-500
            "
          />

          <p className="text-xs text-gray-500 mt-1">
            Supports PDF, DOC, DOCX formats
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
            bg-gradient-to-r from-emerald-500 to-teal-500
            hover:opacity-90 transition
            disabled:opacity-50
          "
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Review Resume
            </>
          )}
        </button>
      </form>

      {/* RIGHT — ANALYSIS RESULTS */}
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
          <FileText className="w-5 h-5 text-emerald-400" />
          <h2 className="font-semibold text-lg text-white">
            Analysis Results
          </h2>
        </div>

        {!content ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <FileText className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-sm text-gray-400 max-w-xs">
              Upload your resume and click{" "}
              <span className="text-white">Review Resume</span> to get
              AI-powered feedback.
            </p>
          </div>
        ) : (

          <div className="mt-4 flex-1 flex flex-col">

            <button
    onClick={downloadPDF}
    className="
      self-end mb-3 px-4 py-2 text-xs rounded-lg
      bg-white/10 hover:bg-white/20 transition
      text-white
    "
  >
    Download
  </button>

            
          <div className="mt-4 flex-1 overflow-y-auto text-sm text-gray-300 pr-2">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
