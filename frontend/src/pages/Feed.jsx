import React, { useCallback, useEffect, useState } from "react";
import api from "../api/client.js";
import PostCard from "../components/PostCard.jsx";
import { Heart } from "lucide-react";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await api.get("/posts/feed");
    setPosts(data.posts);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  if (loading) return <div className="empty-state">Loading your feed…</div>;

  if (!posts.length) {
    return (
      <div className="empty-state">
        <Heart size={40} strokeWidth={1.5} />
        <p>No posts yet. Be the first to share something.</p>
      </div>
    );
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} reload={load} />
      ))}
    </div>
  );
}
