import Link from "next/link";
import {prisma} from "@/lib/prisma";
import {requireRole} from "@/lib/auth";
import {redirect} from "next/navigation";
export default async function Reservations(){
 const s=await requireRole(["ADMIN","STAFF"]);if(!s)redirect("/login");
 const rows=await prisma.reservation.findMany({include:{table:true},orderBy:{dateTime:"asc"}});
 return <div className="shell"><aside className="sidebar"><div className="brand">Dine<span>Desk</span></div><nav className="nav"><Link href="/">▦ Dashboard</Link><Link href="/menu">☷ Menu</Link><Link href="/orders">🛍 Orders</Link><Link href="/reservations">▣ Reservations</Link><Link href="/kitchen">♨ Kitchen</Link></nav></aside><main className="main"><h1>Table Reservations</h1><p className="muted">Guest bookings and table schedule</p><section className="panel"><table><thead><tr><th>Guest</th><th>Email</th><th>Date & time</th><th>Guests</th><th>Table</th><th>Status</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.guestName}</td><td>{r.email}</td><td>{r.dateTime.toLocaleString()}</td><td>{r.guests}</td><td>{r.table?.tableNo||"Unassigned"}</td><td>{r.status}</td></tr>)}{!rows.length&&<tr><td colSpan={6}>No reservations yet.</td></tr>}</tbody></table></section></main></div>;
}
