import Link from "next/link";
import {prisma} from "@/lib/prisma";
import {getSession} from "@/lib/auth";
import {redirect} from "next/navigation";
export default async function Menu(){
 const s=await getSession();if(!s)redirect("/login");
 const categories=await prisma.menuCategory.findMany({include:{items:{where:{isAvailable:true},orderBy:{name:"asc"}}},orderBy:{name:"asc"}});
 return <div className="shell"><aside className="sidebar"><div className="brand">Dine<span>Desk</span></div><nav className="nav"><Link href="/">▦ Dashboard</Link><Link href="/menu">☷ Menu</Link><Link href="/orders">🛍 Orders</Link><Link href="/reservations">▣ Reservations</Link><Link href="/kitchen">♨ Kitchen</Link></nav></aside><main className="main"><h1>Restaurant Menu</h1><p className="muted">Browse available dishes and prices</p>{categories.map(c=><section className="panel" key={c.id}><h2>{c.name}</h2><div className="menu-grid">{c.items.map(i=><article className="menu-card" key={i.id}><h3>{i.name}</h3><p className="muted">{i.description||"Freshly prepared by our kitchen."}</p><div className="price">₹{i.price.toFixed(2)}</div></article>)}</div></section>)}{!categories.length&&<section className="panel">Menu is empty. Add menu categories and dishes to the database to display them here.</section>}</main></div>;
}
