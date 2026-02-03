import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

const PAGE_TITLES = {
  "/ai": "Dashboard",
  "/ai/write-article": "Write Article",
  "/ai/blog-titles": "Blog Titles",
  "/ai/generate-images": "Generate Images",
  "/ai/remove-background": "Remove Background",
  "/ai/remove-object": "Remove Object",
  "/ai/review-resume": "Resume Review",
  "/ai/community": "Community",
  "/ai/profile": "Profile",
};

const Layout = () => {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  const pageTitle =
    PAGE_TITLES[location.pathname] || "Dashboard";

  return user ? (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      
      {/* Sidebar */}
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

      {/* Main */}
      <div className="flex flex-col flex-1">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md border-b border-white/10">
          <h1 className="text-white font-semibold text-lg">
            {pageTitle}
          </h1>

          {/* Mobile toggle */}
          <button
            className="sm:hidden text-white"
            onClick={() => setSidebar(!sidebar)}
          >
            {sidebar ? <X /> : <Menu />}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
