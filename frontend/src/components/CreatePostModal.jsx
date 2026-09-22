import React, { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import api from "../api/client.js";

export default function CreatePostModal({ onClose, onCreated }) {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const previews = files.map((f) => ({ url: URL.createObjectURL(f), type: f.type.startsWith("video/") ? "video" : "image" }));

  async function submit(e) {
    e.preventDefault();
    if (!files.length) {
      setError("Choose at least one photo or video.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      files.forEach((f) => data.append("media", f));
      data.append("caption", caption);
      await api.post("/posts", data);
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not create the post.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create a post</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="create-post-form">
          <label className="file-drop">
            <ImageIcon size={28} />
            <span>{files.length ? `${files.length} file(s) selected` : "Choose photos or videos"}</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
            />
          </label>

          {previews.length > 0 && (
            <div className="preview-grid">
              {previews.map((p, i) =>
                p.type === "video" ? (
                  <video key={i} src={p.url} muted />
                ) : (
                  <img key={i} src={p.url} alt="" />
                )
              )}
            </div>
          )}

          <textarea
            placeholder="Write a caption…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />

          {error && <p className="auth-message error">{error}</p>}

          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? "Sharing…" : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
}
