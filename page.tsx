import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");
  const [students, teachers, attendance, fees] = await Promise.all([
    prisma.student.count(), prisma.teacher.count(),
    prisma.attendance.count({ where: { status: "PRESENT" } }),
    prisma.fee.aggregate({ _sum: { amount: true, paidAmount: true } })
  ]);
  return <div className="shell">
    <aside className="sidebar"><div className="brand">EduManage</div><nav className="nav">
      <Link href="/">▦ Dashboard</Link><Link href="/students">♙ Students</Link>
      <Link href="/teachers">♧ Teachers</Link><Link href="/attendance">✓ Attendance</Link>
      <Link href="/exams">▤ Exams & Results</Link><Link href="/fees">₹ Fees</Link>
    </nav></aside>
    <main className="main"><div className="top"><div><h1>Dashboard</h1><div className="muted">Welcome back, {session.name}</div></div>
      <form action="/api/auth/logout" method="post"><button>Logout</button></form></div>
      <div className="grid">
        <div className="card"><div className="muted">Total students</div><div className="metric">{students}</div></div>
        <div className="card"><div className="muted">Total teachers</div><div className="metric">{teachers}</div></div>
        <div className="card"><div className="muted">Present attendance records</div><div className="metric">{attendance}</div></div>
        <div className="card"><div className="muted">Fees collected</div><div className="metric">₹{(fees._sum.paidAmount || 0).toLocaleString("en-IN")}</div></div>
      </div>
      <section className="panel"><h2>Quick overview</h2><p className="muted">Manage student profiles, teachers, daily attendance, examinations and fee records from the navigation menu.</p>
      <p><b>Fee amount recorded:</b> ₹{(fees._sum.amount || 0).toLocaleString("en-IN")}</p></section>
    </main>
  </div>;
}
