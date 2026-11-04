import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Teachers() {
 const session=await requireRole(["ADMIN","TEACHER"]); if(!session) redirect("/login");
 const rows=await prisma.teacher.findMany({orderBy:{fullName:"asc"}});
 return <div className="shell"><aside className="sidebar"><div className="brand">EduManage</div><nav className="nav"><Link href="/">▦ Dashboard</Link><Link href="/students">♙ Students</Link><Link href="/teachers">♧ Teachers</Link><Link href="/attendance">✓ Attendance</Link><Link href="/exams">▤ Exams</Link><Link href="/fees">₹ Fees</Link></nav></aside><main className="main"><h1>Teachers</h1><p className="muted">Teacher directory</p><section className="panel"><table><thead><tr><th>Employee No.</th><th>Name</th><th>Email</th><th>Subject</th><th>Phone</th></tr></thead><tbody>{rows.map(t=><tr key={t.id}><td>{t.employeeNo}</td><td>{t.fullName}</td><td>{t.email}</td><td>{t.subject}</td><td>{t.phone||"—"}</td></tr>)}{!rows.length&&<tr><td colSpan={5}>No teachers added yet.</td></tr>}</tbody></table></section></main></div>;
}
