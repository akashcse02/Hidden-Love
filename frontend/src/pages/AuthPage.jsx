import React, { useState } from "react";
import { Heart, Mail, Lock, User, AtSign, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { APP_NAME } from "../api/client.js";

const MODES = { LOGIN: "login", REGISTER: "register", VERIFY: "verify" };

export default function AuthPage() {
  const { login, register, verifyEmail } = useAuth();
  const [mode, setMode] = useState(MODES.LOGIN);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", code: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (mode === MODES.REGISTER) {
        const data = await register(form);
        setMessage(data.message || "Account created. Check the backend terminal for your verification code.");
        setMode(MODES.VERIFY);
      } else if (mode === MODES.VERIFY) {
        await verifyEmail(form.email, form.code);
        setMessage("Email verified — you can log in now.");
        setMode(MODES.LOGIN);
      } else {
        await login(form.email, form.password);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <Heart className="brand-heart" size={40} strokeWidth={1.8} />
          <h1>{APP_NAME}</h1>
          <p>Some connections are worth keeping close.</p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h2>
            {mode === MODES.LOGIN && "Welcome back"}
            {mode === MODES.REGISTER && "Create your account"}
            {mode === MODES.VERIFY && "Verify your email"}
          </h2>
          <p className="auth-subtitle">
            {mode === MODES.LOGIN && "Log in to see what your circle has been sharing."}
            {mode === MODES.REGISTER && "Join and start sharing your moments privately."}
            {mode === MODES.VERIFY && `Enter the 6-digit code sent for ${form.email || "your email"}.`}
          </p>

          <form onSubmit={submit} className="auth-form">
            {mode === MODES.REGISTER && (
              <>
                <div className="input-group">
                  <User size={18} />
                  <input name="name" placeholder="Full name" value={form.name} onChange={update} required />
                </div>
                <div className="input-group">
                  <AtSign size={18} />
                  <input name="username" placeholder="Username" value={form.username} onChange={update} required />
                </div>
              </>
            )}

            {mode !== MODES.VERIFY && (
              <div className="input-group">
                <Mail size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={update}
                  required
                />
              </div>
            )}

            {mode === MODES.VERIFY && (
              <>
                <div className="input-group">
                  <Mail size={18} />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={update}
                    required
                  />
                </div>
                <div className="input-group">
                  <ShieldCheck size={18} />
                  <input
                    name="code"
                    placeholder="Verification code"
                    value={form.code}
                    onChange={update}
                    maxLength={6}
                    required
                  />
                </div>
              </>
            )}

            {mode !== MODES.VERIFY && (
              <div className="input-group">
                <Lock size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={update}
                  required
                />
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === MODES.LOGIN
                ? "Log in"
                : mode === MODES.VERIFY
                ? "Verify email"
                : "Create account"}
            </button>
          </form>

          {message && <p className="auth-message success">{message}</p>}
          {error && <p className="auth-message error">{error}</p>}

          <div className="auth-switch">
            {mode === MODES.LOGIN && (
              <span>
                New to {APP_NAME}?{" "}
                <a onClick={() => { setMode(MODES.REGISTER); setError(""); setMessage(""); }}>Create an account</a>
              </span>
            )}
            {mode === MODES.REGISTER && (
              <span>
                Already have an account?{" "}
                <a onClick={() => { setMode(MODES.LOGIN); setError(""); setMessage(""); }}>Log in</a>
              </span>
            )}
            {mode === MODES.VERIFY && (
              <span>
                Back to <a onClick={() => { setMode(MODES.LOGIN); setError(""); setMessage(""); }}>login</a>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
