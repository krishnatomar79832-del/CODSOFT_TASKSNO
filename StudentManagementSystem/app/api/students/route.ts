import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const session = await requireRole(["ADMIN","TEACHER"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await prisma.student.findMany({ orderBy: { createdAt: "desc" } }));
}
export async function POST(req: Request) {
  const session = await requireRole(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  try {
    const body = await req.json();
    const student = await prisma.student.create({ data: {
      admissionNo: String(body.admissionNo), fullName: String(body.fullName),
      email: String(body.email).toLowerCase(), className: String(body.className),
      section: body.section ? String(body.section) : null,
      phone: body.phone ? String(body.phone) : null,
      address: body.address ? String(body.address) : null
    }});
    return NextResponse.json(student, { status: 201 });
  } catch { return NextResponse.json({ error: "Could not create student. Check for duplicate admission number or email." }, { status: 400 }); }
}
