import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireRole} from "@/lib/auth";
export async function GET(){const s=await requireRole(["ADMIN","STAFF"]);if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});return NextResponse.json(await prisma.reservation.findMany({include:{table:true},orderBy:{dateTime:"asc"}}));}
export async function POST(req:Request){
 try{const b=await req.json();if(!b.guestName||!b.email||!b.dateTime||!b.guests)return NextResponse.json({error:"Name, email, date and guest count are required"},{status:400});
 const date=new Date(b.dateTime);if(Number.isNaN(date.getTime())||date.getTime()<Date.now())return NextResponse.json({error:"Choose a future reservation date and time"},{status:400});
 const row=await prisma.reservation.create({data:{guestName:String(b.guestName),email:String(b.email).toLowerCase(),phone:b.phone?String(b.phone):null,dateTime:date,guests:Math.max(1,Math.min(20,Number(b.guests))),notes:b.notes?String(b.notes):null}});
 return NextResponse.json(row,{status:201});
 }catch{return NextResponse.json({error:"Could not create reservation"},{status:400});}
}
