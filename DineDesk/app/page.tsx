import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Home() {
 const session=await getSession(); if(!session) redirect("/login");
 const [orders,reservations,menuItems,tables]=await Promise.all([
  prisma.order.count(),prisma.reservation.count({where:{status:{in:["PENDING","CONFIRMED"]}}}),
  prisma.menuItem.count({where:{isAvailable:true}}),prisma.restaurantTable.count({where:{active:true}})
 ]);
 const recent=await prisma.order.findMany({take:8,orderBy:{createdAt:"desc"}});
 return <div className="shell"><aside className="sidebar"><div className="brand">Dine<span>Desk</span></div><nav className="nav">
 <Link href="/">▦ Dashboard</Link><Link href="/menu">☷ Menu</Link><Link href="/orders">🛍 Orders</Link><Link href="/reservations">▣ Reservations</Link><Link href="/kitchen">♨ Kitchen</Link></nav></aside>
 <main className="main"><div className="top"><div><h1>Restaurant Dashboard</h1><div className="muted">Welcome, {session.name} · {session.role}</div></div><form action="/api/auth/logout" method="post"><button>Logout</button></form></div>
 <div className="grid"><div className="card"><div className="muted">Total orders</div><div className="metric">{orders}</div></div><div className="card"><div className="muted">Open reservations</div><div className="metric">{reservations}</div></div><div className="card"><div className="muted">Available menu items</div><div className="metric">{menuItems}</div></div><div className="card"><div className="muted">Restaurant tables</div><div className="metric">{tables}</div></div></div>
 <section className="panel"><h2>Recent orders</h2><table><thead><tr><th>Order</th><th>Customer</th><th>Type</th><th>Total</th><th>Status</th></tr></thead><tbody>{recent.map(o=><tr key={o.id}><td>{o.orderNo}</td><td>{o.customerName}</td><td>{o.orderType}</td><td>₹{o.total.toFixed(2)}</td><td><span className="badge">{o.status}</span></td></tr>)}{!recent.length&&<tr><td colSpan={5}>No orders yet. Visit Menu to browse items.</td></tr>}</tbody></table></section>
 </main></div>;
}
