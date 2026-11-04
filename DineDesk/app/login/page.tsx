"use client";
import {useState} from "react";
export default function Login(){
 const[email,setEmail]=useState("");const[password,setPassword]=useState("");const[error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setError("");const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok){setError(d.error||"Login failed");return;}location.href="/";}
 return <main className="login-wrap"><div className="login"><h1>Dine<span style={{color:"#ef8b2c"}}>Desk</span></h1><p className="muted">Sign in to your restaurant workspace</p><form className="form" onSubmit={submit}><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/><button>Login</button></form>{error&&<p style={{color:"crimson"}}>{error}</p>}<p className="muted">Use the seeded admin account for the first login.</p></div></main>;
}
