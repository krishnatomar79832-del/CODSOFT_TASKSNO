"use client";
import { useState } from "react";
export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
    const data=await r.json(); if(!r.ok){setError(data.error||"Login failed");return;} window.location.href="/";
  }
  return <main className="login-wrap"><div className="login"><h1>EduManage</h1><p className="muted">Sign in to your management portal</p>
    <form className="form" onSubmit={submit}><input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">Login</button></form>{error&&<p style={{color:"crimson"}}>{error}</p>}
      <p className="muted">First-time setup: create an admin using the seed command in README.</p></div></main>;
}
