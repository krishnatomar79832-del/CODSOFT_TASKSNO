import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Students() {
  const session=await requireRole(["ADMIN","TEACHER"]); if(!session) redirect("/login");
  const rows=await prisma.student.findMany({orderBy:{createdAt:"desc"}});
  return <div className="shell"><aside className="sidebar"><div className="brand">EduManage</div><nav className="nav"><Link href="/">▦ Dashboard</Link><Link href="/students">♙ Students</Link><Link href="/teachers">♧ Teachers</Link><Link href="/attendance">✓ Attendance</Link><Link href="/exams">▤ Exams</Link><Link href="/fees">₹ Fees</Link></nav></aside>
  <main className="main"><h1>Students</h1><p className="muted">Student directory and admission records</p>
  <section className="panel"><table><thead><tr><th>Admission No.</th><th>Name</th><th>Email</th><th>Class</th><th>Phone</th></tr></thead><tbody>
  {rows.map(s=><tr key={s.id}><td>{s.admissionNo}</td><td>{s.fullName}</td><td>{s.email}</td><td>{s.className}{s.section?` - ${s.section}`:""}</td><td>{s.phone||"—"}</td></tr>)}
  {!rows.length&&<tr><td colSpan={5}>No students added yet. Use POST /api/students to add the first record.</td></tr>}</tbody></table></section></main></div>;
}
