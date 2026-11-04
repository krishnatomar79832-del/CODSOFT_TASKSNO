import Link from "next/link";
import {prisma} from "@/lib/prisma";
import {requireRole} from "@/lib/auth";
import {redirect} from "next/navigation";
export default async function Kitchen(){
 const s=await requireRole(["ADMIN","CHEF","STAFF"]);if(!s)redirect("/login");
 const rows=await prisma.order.findMany({where:{status:{in:["PLACED","ACCEPTED","PREPARING","READY"]}},include:{items:{include:{menuItem:true}}},orderBy:{createdAt:"asc"}});
 return <div className="shell"><aside className="sidebar"><div className="brand">Dine<span>Desk</span></div><nav className="nav"><Link href="/">▦ Dashboard</Link><Link href="/menu">☷ Menu</Link><Link href="/orders">🛍 Orders</Link><Link href="/reservations">▣ Reservations</Link><Link href="/kitchen">♨ Kitchen</Link></nav></aside><main className="main"><h1>Kitchen Display</h1><p className="muted">Live queue of orders awaiting preparation</p><div className="grid">{rows.map(o=><article className="card" key={o.id}><span className="badge">{o.status}</span><h2>{o.orderNo}</h2><p><b>{o.customerName}</b></p>{o.items.map(i=><p key={i.id}>{i.quantity} × {i.menuItem.name}</p>)}{o.notes&&<p className="muted">Note: {o.notes}</p>}<p className="price">₹{o.total.toFixed(2)}</p></article>)}{!rows.length&&<div className="card">Kitchen queue is clear. New orders will appear here.</div>}</div></main></div>;
}
