import Link from "next/link";
import {prisma} from "@/lib/prisma";
import {requireRole} from "@/lib/auth";
import {redirect} from "next/navigation";
export default async function Orders(){
 const s=await requireRole(["ADMIN","STAFF","CHEF"]);if(!s)redirect("/login");
 const rows=await prisma.order.findMany({include:{items:{include:{menuItem:true}}},orderBy:{createdAt:"desc"}});
 return <div className="shell"><aside className="sidebar"><div className="brand">Dine<span>Desk</span></div><nav className="nav"><Link href="/">▦ Dashboard</Link><Link href="/menu">☷ Menu</Link><Link href="/orders">🛍 Orders</Link><Link href="/reservations">▣ Reservations</Link><Link href="/kitchen">♨ Kitchen</Link></nav></aside><main className="main"><h1>Orders</h1><p className="muted">All incoming restaurant orders</p><section className="panel"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Placed</th></tr></thead><tbody>{rows.map(o=><tr key={o.id}><td>{o.orderNo}</td><td>{o.customerName}</td><td>{o.items.map(i=>`${i.menuItem.name} × ${i.quantity}`).join(", ")}</td><td>₹{o.total.toFixed(2)}</td><td><span className="badge">{o.status}</span></td><td>{o.createdAt.toLocaleString()}</td></tr>)}{!rows.length&&<tr><td colSpan={6}>No orders received yet.</td></tr>}</tbody></table></section></main></div>;
}
