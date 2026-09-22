import React, { useEffect, useState } from "react";
import { Camera, Search, UserPlus, UserCheck } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Profile() {
  const { user, setUser, refresh } = useAuth();
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    setBio(user?.bio || "");
  }, [user]);

  async function saveBio(e) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    try {
      const { data } = await api.patch("/users/me", { bio });
      setUser(data.user);
      setSavedMsg("Saved.");
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(""), 2000);
    }
  }

  async function uploadAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("avatar", file);
      await api.post("/users/avatar", form);
      await refresh();
    } finally {
      setUploading(false);
    }
  }

  async function search(e) {
    const q = e.target.value;
    setQuery(q);
    if (!q) {
      setResults([]);
      return;
    }
    const { data } = await api.get(`/users/search?q=${encodeURIComponent(q)}`);
    setResults(data.users.filter((u) => u._id !== user.id));
  }

  async function toggleFollow(person) {
    const { data } = await api.post(`/users/${person._id}/follow`);
    setResults((prev) =>
      prev.map((p) => (p._id === person._id ? { ...p, following: data.following } : p))
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-card">
        <div className="profile-avatar-wrap">
          <Avatar user={user} size={92} />
          <label className="avatar-upload-btn" title="Change photo">
            <Camera size={16} />
            <input type="file" accept="image/*" onChange={uploadAvatar} hidden />
          </label>
        </div>
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p className="muted">@{user?.username}</p>
          <div className="profile-stats">
            <span><b>{user?.followers?.length || 0}</b> followers</span>
            <span><b>{user?.following?.length || 0}</b> following</span>
          </div>
        </div>
      </section>

      <section className="profile-card">
        <h3>About you</h3>
        <form onSubmit={saveBio} className="bio-form">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            placeholder="Write a short bio…"
            rows={3}
          />
          <div className="bio-form-footer">
            <span className="muted">{bio.length}/160</span>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save bio"}
            </button>
          </div>
          {savedMsg && <p className="auth-message success">{savedMsg}</p>}
        </form>
      </section>

      <section className="profile-card">
        <h3>Find people</h3>
        <div className="input-group search-group">
          <Search size={16} />
          <input placeholder="Search by name or username…" value={query} onChange={search} />
        </div>
        <div className="discover-list">
          {results.map((p) => (
            <div className="discover-row" key={p._id}>
              <div className="discover-user">
                <Avatar user={p} size={36} />
                <div>
                  <b>{p.name}</b>
                  <p className="muted">@{p.username}</p>
                </div>
              </div>
              <button className="btn-outline" onClick={() => toggleFollow(p)}>
                {p.following ? <UserCheck size={16} /> : <UserPlus size={16} />}
                {p.following ? "Following" : "Follow"}
              </button>
            </div>
          ))}
          {uploading && <p className="muted">Uploading photo…</p>}
        </div>
      </section>
    </div>
  );
}
