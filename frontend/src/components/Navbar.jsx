import React from "react";
import { Heart, Home, MessageCircle, PlusSquare, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { APP_NAME } from "../api/client.js";
import Avatar from "./Avatar.jsx";

export default function Navbar({ view, setView, onCreate }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand" onClick={() => setView("home")}>
        <Heart size={22} strokeWidth={2} />
        <span>{APP_NAME}</span>
      </div>

      <nav className="navbar-links">
        <button className={view === "home" ? "active" : ""} onClick={() => setView("home")} title="Home">
          <Home size={20} />
          <span>Home</span>
        </button>
        <button className={view === "chat" ? "active" : ""} onClick={() => setView("chat")} title="Messages">
          <MessageCircle size={20} />
          <span>Messages</span>
        </button>
        <button onClick={onCreate} title="Create post">
          <PlusSquare size={20} />
          <span>Create</span>
        </button>
        <button
          className={view === "profile" ? "active" : ""}
          onClick={() => setView("profile")}
          title="Profile"
        >
          <UserIcon size={20} />
          <span>Profile</span>
        </button>
      </nav>

      <div className="navbar-user">
        <Avatar user={user} size={34} />
        <button className="icon-btn" onClick={logout} title="Log out">
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}
