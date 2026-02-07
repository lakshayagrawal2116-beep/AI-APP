import React, { useEffect, useState } from "react";
import { Gem, Sparkles, Clock } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationsItems from "../components/CreationsItems.jsx";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

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

  useEffect(() => {
    getDashboardData();
  }, [getToken]);

  return (
    <div className="h-full p-6 max-w-7xl mx-auto text-white space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-400">
          Your recent AI activity and usage overview
        </p>
      </div>

      {/* STATS */}
      <div className="flex flex-wrap gap-4">
        {/* Total Creations */}
        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 min-w-[240px]">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Total Creations</p>
            <p className="text-xl font-semibold">
              {loading ? "—" : creations.length}
            </p>
          </div>
        </div>

        {/* Active Plan */}
        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 min-w-[240px]">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <Gem size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Active Plan</p>
            <p className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </p>
          </div>
        </div>
      </div>

      {/* RECENT CREATIONS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h2 className="text-lg font-medium">Recent Creations</h2>
        </div>

        {loading ? (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-gray-400">
            Loading your creations…
          </div>
        ) : creations.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center text-gray-400">
            No creations yet. Start using the tools 🚀
          </div>
        ) : (
          <div className="space-y-3">
            {creations.map((item) => (
              <CreationsItems key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
