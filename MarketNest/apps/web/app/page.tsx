"use client";
import { useEffect, useMemo, useState } from "react";

type Product = { id:string; name:string; description:string; price:number; stock:number; category:{name:string}; seller:{storeName:string} };
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const icons:Record<string,string>={Electronics:"🎧",Fashion:"🎒","Home & Living":"💡",Books:"📚"};
export default function Home(){
 const [products,setProducts]=useState<Product[]>([]);const [query,setQuery]=useState("");const [category,setCategory]=useState("All");const [loading,setLoading]=useState(true);const [message,setMessage]=useState("");
 useEffect(()=>{fetch(`${API}/api/products`).then(r=>r.json()).then(d=>setProducts(Array.isArray(d)?d:[])).catch(()=>setMessage("Could not connect to API. Start the backend on port 4000.")).finally(()=>setLoading(false));},[]);
 const categories=useMemo(()=>["All",...Array.from(new Set(products.map(p=>p.category.name)))],[products]);
 const shown=products.filter(p=>(category==="All"||p.category.name===category)&&(`${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())));
 return <><header className="header"><div className="wrap bar"><a className="logo" href="/">Market<span>Nest</span></a><nav className="links"><a href="#products">Explore</a><a href="#sellers">For sellers</a><a href="#about">About</a></nav><a className="btn" href="#products">Shop now</a></div></header>
 <main className="wrap"><section className="hero"><span className="pill">ONE MARKETPLACE · MANY POSSIBILITIES</span><h1>Discover great products from independent sellers.</h1><p>Shop across categories, compare products and support growing businesses — all in one place.</p><form className="search" onSubmit={e=>e.preventDefault()}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products..." aria-label="Search products"/><button className="btn">Search</button></form></section>
 <section id="products"><div className="section-title"><div><h2>Explore products</h2><div style={{color:"#718096"}}>Handpicked items from our seller community</div></div><span className="pill">{shown.length} products</span></div>
 <div className="row" style={{justifyContent:"flex-start",flexWrap:"wrap",marginBottom:18}}>{categories.map(c=><button key={c} className={category===c?"btn":"field"} onClick={()=>setCategory(c)}>{c}</button>)}</div>
 {message&&<div className="empty">{message}</div>}{loading?<div className="empty">Loading marketplace...</div>:<div className="grid">{shown.map(p=><article className="card" key={p.id}><div className="product-art">{icons[p.category.name]||"🛍️"}</div><div className="card-body"><div className="category">{p.category.name}</div><h3>{p.name}</h3><div className="desc">{p.description}</div><div className="price">₹{p.price.toLocaleString("en-IN")}</div><div className="seller">Sold by {p.seller.storeName}</div><div className="row"><span className="pill">{p.stock>0?`${p.stock} in stock`:"Out of stock"}</span><button className="btn" disabled={p.stock<1} onClick={()=>setMessage(`To place an order, use the POST /api/orders endpoint described in the project README. Product ID: ${p.id}`)}>Buy now</button></div></div></article>)}</div>}
 {!loading&&!shown.length&&!message&&<div className="empty">No products match this search.</div>}</section>
 <section id="sellers" className="hero" style={{background:"linear-gradient(115deg,#19365e,#287b83)"}}><h1 style={{fontSize:30}}>Have a business? Grow with MarketNest.</h1><p>Bring your products online, manage inventory and reach more customers with a single seller platform.</p><a className="btn" href="mailto:sellers@marketnest.local">Become a seller</a></section>
 <section id="about" className="section-title"><div><h2>One platform, connected commerce</h2><p style={{color:"#718096"}}>Customer discovery · Seller storefronts · Inventory · Orders · Promotions</p></div></section>
 </main><footer className="footer"><div className="wrap row"><b>MarketNest</b><span>Built for customers and growing sellers.</span></div></footer></>;
}
