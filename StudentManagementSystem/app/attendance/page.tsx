import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Attendance() {
 const session=await requireRole(["ADMIN","TEACHER"]); if(!session) redirect("/login");
 const rows=await prisma.attendance.findMany({include:{student:true},orderBy:{date:"desc"},take:100});
 return <div className="shell"><aside className="sidebar"><div className="brand">EduManage</div><nav className="nav"><Link href="/">▦ Dashboard</Link><Link href="/students">♙ Students</Link><Link href="/teachers">♧ Teachers</Link><Link href="/attendance">✓ Attendance</Link><Link href="/exams">▤ Exams</Link><Link href="/fees">₹ Fees</Link></nav></aside><main className="main"><h1>Attendance</h1><p className="muted">Latest attendance records</p><section className="panel"><table><thead><tr><th>Date</th><th>Admission No.</th><th>Student</th><th>Subject</th><th>Status</th></tr></thead><tbody>{rows.map(a=><tr key={a.id}><td>{a.date.toLocaleDateString()}</td><td>{a.student.admissionNo}</td><td>{a.student.fullName}</td><td>{a.subject||"—"}</td><td>{a.status}</td></tr>)}{!rows.length&&<tr><td colSpan={5}>No attendance records yet. Create records using the API documented in README.</td></tr>}</tbody></table></section></main></div>;
}
