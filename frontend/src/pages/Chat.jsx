import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Search, Send } from "lucide-react";
import api, { SOCKET_URL } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Chat() {
  const { user } = useAuth();
  const socketRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { auth: { token: localStorage.getItem("hl_token") } });
    socketRef.current.on("newMessage", (m) => setMessages((prev) => [...prev, m]));
    api.get("/chat/conversations").then((r) => setConversations(r.data.conversations));
    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  async function openConversation(person) {
    const { data } = await api.post("/chat/conversations", { userId: person._id });
    setActive(data.conversation);
    const { data: msgData } = await api.get(`/chat/conversations/${data.conversation._id}/messages`);
    setMessages(msgData.messages);
    socketRef.current.emit("joinConversation", data.conversation._id);
    setResults([]);
    setQuery("");
    setConversations((prev) => {
      const exists = prev.some((c) => c._id === data.conversation._id);
      return exists ? prev : [data.conversation, ...prev];
    });
  }

  function otherMember(conversation) {
    return conversation.members.find((m) => String(m._id) !== String(user.id));
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || !active) return;
    const receiver = otherMember(active);
    socketRef.current.emit("sendMessage", {
      conversationId: active._id,
      receiverId: receiver._id,
      text: text.trim()
    });
    setText("");
  }

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <h2>Messages</h2>
        <div className="input-group search-group">
          <Search size={16} />
          <input placeholder="Search people…" value={query} onChange={search} />
        </div>

        {results.length > 0 && (
          <div className="search-results">
            {results.map((u) => (
              <button className="person-row" key={u._id} onClick={() => openConversation(u)}>
                <Avatar user={u} size={32} />
                <span>@{u.username}</span>
              </button>
            ))}
          </div>
        )}

        <div className="conversation-list">
          {conversations.map((c) => {
            const person = otherMember(c);
            return (
              <button
                className={`person-row ${active?._id === c._id ? "active" : ""}`}
                key={c._id}
                onClick={() => openConversation(person)}
              >
                <Avatar user={person} size={36} />
                <span>@{person?.username}</span>
              </button>
            );
          })}
          {!conversations.length && <p className="muted">No conversations yet — search for someone above.</p>}
        </div>
      </aside>

      <section className="chat-window">
        {active ? (
          <>
            <div className="chat-window-header">
              <Avatar user={otherMember(active)} size={32} />
              <b>@{otherMember(active)?.username}</b>
            </div>
            <div className="messages">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={String(m.sender?._id || m.sender) === String(user.id) ? "bubble mine" : "bubble"}
                >
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-form" onSubmit={sendMessage}>
              <input placeholder="Write a message…" value={text} onChange={(e) => setText(e.target.value)} />
              <button type="submit">
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="empty-state">
            <p>Select a conversation or search for someone to message.</p>
          </div>
        )}
      </section>
    </div>
  );
}
