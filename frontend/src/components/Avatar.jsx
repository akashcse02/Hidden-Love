import React from "react";
import { avatarUrl } from "../api/client.js";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";
}

export default function Avatar({ user, size = 40 }) {
  const url = user?.avatarFileId ? avatarUrl(user.avatarFileId) : null;
  const style = { width: size, height: size, fontSize: size * 0.4 };

  if (url) {
    return <img className="avatar" style={style} src={url} alt={user?.username || "avatar"} />;
  }
  return (
    <div className="avatar avatar-fallback" style={style}>
      {initials(user?.name || user?.username)}
    </div>
  );
}
