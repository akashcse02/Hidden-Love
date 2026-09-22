import React, { useState } from "react";
import { Heart, MessageCircle, Share2, Link as LinkIcon } from "lucide-react";
import api, { mediaUrl } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const units = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60]
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label}`;
  }
  return "now";
}

export default function PostCard({ post, reload }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [copied, setCopied] = useState(false);

  const liked = post.likes.some((id) => String(id) === String(user?.id));

  async function toggleLike() {
    await api.post(`/posts/${post._id}/like`);
    reload();
  }

  async function submitComment(e) {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    await api.post(`/posts/${post._id}/comment`, { text });
    setCommentText("");
    reload();
  }

  function share() {
    const url = `${window.location.origin}${window.location.pathname}#post-${post._id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const comments = showAllComments ? post.comments : post.comments.slice(-2);

  return (
    <article className="post-card" id={`post-${post._id}`}>
      <div className="post-header">
        <Avatar user={post.author} size={38} />
        <div>
          <b>@{post.author.username}</b>
          <span className="post-time">{timeAgo(post.createdAt)}</span>
        </div>
      </div>

      {post.media?.length > 0 && (
        <div className="post-media">
          {post.media.map((m) =>
            m.type === "video" ? (
              <video key={m.fileId} src={mediaUrl(m.fileId)} controls />
            ) : (
              <img key={m.fileId} src={mediaUrl(m.fileId)} alt="" />
            )
          )}
        </div>
      )}

      <div className="post-actions">
        <button className={liked ? "liked" : ""} onClick={toggleLike}>
          <Heart size={22} fill={liked ? "currentColor" : "none"} />
        </button>
        <button onClick={() => document.getElementById(`comment-input-${post._id}`)?.focus()}>
          <MessageCircle size={22} />
        </button>
        <button onClick={share} title="Copy link to post">
          {copied ? <LinkIcon size={22} /> : <Share2 size={22} />}
        </button>
      </div>

      <div className="post-likes">{post.likes.length} {post.likes.length === 1 ? "like" : "likes"}</div>

      {post.caption && (
        <p className="post-caption">
          <b>@{post.author.username}</b> {post.caption}
        </p>
      )}

      {post.comments.length > 2 && !showAllComments && (
        <button className="view-comments" onClick={() => setShowAllComments(true)}>
          View all {post.comments.length} comments
        </button>
      )}

      {comments.map((c) => (
        <div className="post-comment" key={c._id}>
          <b>@{c.user?.username}</b> {c.text}
        </div>
      ))}

      <form className="comment-form" onSubmit={submitComment}>
        <input
          id={`comment-input-${post._id}`}
          placeholder="Add a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" disabled={!commentText.trim()}>
          Post
        </button>
      </form>
    </article>
  );
}
