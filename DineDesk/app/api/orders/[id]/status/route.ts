import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireRole} from "@/lib/auth";
const allowed=["PLACED","ACCEPTED","PREPARING","READY","COMPLETED","CANCELLED"];
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const s=await requireRole(["ADMIN","STAFF","CHEF"]);if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});
 const{id}=await params;const{status}=await req.json();if(!allowed.includes(status))return NextResponse.json({error:"Invalid status"},{status:400});
 try{return NextResponse.json(await prisma.order.update({where:{id},data:{status}}));}catch{return NextResponse.json({error:"Order not found"},{status:404});}
}
