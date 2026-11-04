import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Exams() {
 const session=await requireRole(["ADMIN","TEACHER","STUDENT"]); if(!session) redirect("/login");
 const rows=await prisma.exam.findMany({include:{results:{include:{student:true}}},orderBy:{examDate:"desc"}});
 return <div className="shell"><aside className="sidebar"><div className="brand">EduManage</div><nav className="nav"><Link href="/">▦ Dashboard</Link><Link href="/students">♙ Students</Link><Link href="/teachers">♧ Teachers</Link><Link href="/attendance">✓ Attendance</Link><Link href="/exams">▤ Exams</Link><Link href="/fees">₹ Fees</Link></nav></aside><main className="main"><h1>Exams & Results</h1><p className="muted">Exam schedules and student marks</p>{rows.map(e=><section className="panel" key={e.id}><h2>{e.title}</h2><p>{e.subject} · Class {e.className} · {e.examDate.toLocaleDateString()} · Max marks: {e.maxMarks}</p><table><thead><tr><th>Student</th><th>Marks</th><th>Grade</th></tr></thead><tbody>{e.results.map(r=><tr key={r.id}><td>{r.student.fullName}</td><td>{r.marks}</td><td>{r.grade||"—"}</td></tr>)}</tbody></table></section>)}{!rows.length&&<section className="panel">No exams have been created yet.</section>}</main></div>;
}
