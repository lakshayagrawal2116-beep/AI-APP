import React, { useState } from "react";
import { Sparkles, FileText, Upload } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";


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
      setContent("");
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(
        axios.defaults.baseURL + "/api/ai/review-resume",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          body: formData,
        }
      );

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!data.success) {
          toast.error(data.message);
        }
        setLoading(false);
        return;
      }

      if (!response.body) {
        toast.error("Streaming not supported");
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let streamedText = "";
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          let parts = buffer.split("\n\n");
          buffer = parts.pop();
          for (const part of parts) {
            if (part.startsWith("data: ")) {
              const dataStr = part.substring(6);
              if (dataStr === "[DONE]") {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                streamedText += parsed.text;
                setContent(streamedText);
              } catch (err) { }
            }
          }
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!content) {
      toast.error("Nothing to download");
      return;
    }

    const element = document.getElementById("pdf-content");
    if (!element) return;

    toast.success("Generating PDF...", { id: "pdf-gen" });

    try {
      const originalPadding = element.style.padding;
      element.style.padding = "20px";

      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: '#111827'
      });

      element.style.padding = originalPadding;

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const imgWidth = img.width;
      const imgHeight = img.height;

      const ratio = pdfWidth / imgWidth;
      const scaledImgHeight = imgHeight * ratio;

      let heightLeft = scaledImgHeight;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, scaledImgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - scaledImgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, scaledImgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("resume-review.pdf");
      toast.success("PDF Downloaded!", { id: "pdf-gen" });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to generate", { id: "pdf-gen" });
    }
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
              <div id="pdf-content" className="reset-tw">
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
