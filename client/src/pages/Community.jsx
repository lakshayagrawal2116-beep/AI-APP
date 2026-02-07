import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Heart, Download, Crown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  const isPremium = user?.publicMetadata?.plan === "premium";

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get(
        "/api/user/get-published-creations",
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const downloadImage = async (url, filename = "image.png") => {
  if (!isPremium) {
    toast.error("Download is only available for premium users");
    return;
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  } catch (error) {
    toast.error("Failed to download image");
  }
};

  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-white">Community Creations</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {creations.map((creation) => (
          <div
  key={creation.id}
  className="relative group rounded-xl overflow-hidden bg-black/20"
>
  {/* IMAGE */}
  <img
    src={creation.content}
    alt={creation.prompt}
    className="w-full h-64 object-cover"
    loading="lazy"
  />

  {/* DOWNLOAD BUTTON (FIXED) */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      downloadImage(
        creation.content,
        `quickai-${creation.id}.png`
      );
    }}
    className="
      absolute top-3 right-3 z-30
      p-2 rounded-lg
      bg-black/70 hover:bg-black/90
      transition
    "
    title="Download image"
  >
    <Download className="w-4 h-4 text-white" />
  </button>

  {/* OVERLAY */}
  <div
    className="
      absolute inset-0 z-10
      bg-black/60
      opacity-0 group-hover:opacity-100
      transition
      flex flex-col justify-between p-4
    "
  >
    {/* Prompt */}
    <p className="text-sm text-white line-clamp-3">
      {creation.prompt}
    </p>

    {/* Likes */}
    <div className="flex items-center gap-2 text-white">
      <span>{creation.likes?.length || 0}</span>
      <Heart
        onClick={() => imageLikeToggle(creation.id)}
        className={`w-5 h-5 cursor-pointer transition ${
          creation.likes?.includes(user?.id)
            ? "fill-red-500 text-red-500"
            : "hover:scale-110"
        }`}
      />
    </div>
  </div>
</div>

        ))}
      </div>
    </div>
  );
};

export default Community;
