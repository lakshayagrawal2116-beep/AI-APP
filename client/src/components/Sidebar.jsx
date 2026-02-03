import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  Link,
  LogOut,
  Scissors,
  SquarePen,
  User,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  return (
    <aside
      className={`
        fixed sm:static inset-y-0 left-0 z-40
        w-60
        bg-white/5 backdrop-blur-md
        border-r border-white/10
        flex flex-col
        transition-transform duration-300
        ${sidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/10">
      <NavLink to={'/'}><img src="/Logo.png" alt="Logo" className="h-8" /></NavLink>
        
      </div>

      {/* User */}
      <div className="py-6 text-center text-white">
        <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center mx-auto text-lg font-semibold">
          {user.firstName?.[0]}
        </div>
        <p className="mt-2 font-medium">{user.fullName}</p>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-1 text-white">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/ai"}
            onClick={() => setSidebar(false)}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm
              transition-all
              ${
                isActive
                  ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                  : "text-gray-300 hover:bg-white/10"
              }
            `
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}

        {/* Profile */}
        <button 
          onClick={() => {
            openUserProfile();
            setSidebar(false);
          }}
          className="w-full mt-2 flex items-center bg-blue-500/20  gap-3 px-3 py-2 rounded-lg text-sm text-gray-300  hover:bg-blue-500/30"
        >
          <User className="w-4 h-4" />
          Profile
        </button>
      </nav>

      {/* Logout */}
      <div className="mt-auto p-4">
        <button
          onClick={() => {
            signOut();
            setSidebar(false);
          }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
