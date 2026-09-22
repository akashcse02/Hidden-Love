import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "./context/AuthContext.jsx";
import { APP_NAME } from "./api/client.js";
import AuthPage from "./pages/AuthPage.jsx";
import Feed from "./pages/Feed.jsx";
import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";
import CreatePostModal from "./components/CreatePostModal.jsx";

export default function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState("home");
  const [showCreate, setShowCreate] = useState(false);
  const [feedKey, setFeedKey] = useState(0);

  if (loading) {
    return (
      <div className="splash">
        <Heart size={36} strokeWidth={1.8} />
        <p>{APP_NAME}</p>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <div className="app-shell">
      <Navbar view={view} setView={setView} onCreate={() => setShowCreate(true)} />
      <main className="app-main">
        {view === "home" && <Feed key={feedKey} />}
        {view === "chat" && <Chat />}
        {view === "profile" && <Profile />}
      </main>
      {showCreate && (
        <CreatePostModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setView("home");
            setFeedKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
