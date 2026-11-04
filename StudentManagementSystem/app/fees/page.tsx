import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Fees() {
 const session=await requireRole(["ADMIN","STUDENT"]); if(!session) redirect("/login");
 const rows=await prisma.fee.findMany({include:{student:true},orderBy:{dueDate:"asc"}});
 return <div className="shell"><aside className="sidebar"><div className="brand">EduManage</div><nav className="nav"><Link href="/">▦ Dashboard</Link><Link href="/students">♙ Students</Link><Link href="/teachers">♧ Teachers</Link><Link href="/attendance">✓ Attendance</Link><Link href="/exams">▤ Exams</Link><Link href="/fees">₹ Fees</Link></nav></aside><main className="main"><h1>Fee Management</h1><p className="muted">Fee payments and outstanding balances</p><section className="panel"><table><thead><tr><th>Student</th><th>Description</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Status</th><th>Due date</th></tr></thead><tbody>{rows.map(f=><tr key={f.id}><td>{f.student.fullName}</td><td>{f.description||"Fee"}</td><td>₹{f.amount}</td><td>₹{f.paidAmount}</td><td>₹{f.amount-f.paidAmount}</td><td>{f.status}</td><td>{f.dueDate.toLocaleDateString()}</td></tr>)}{!rows.length&&<tr><td colSpan={7}>No fee records yet.</td></tr>}</tbody></table></section></main></div>;
}
