import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireRole} from "@/lib/auth";
export async function GET(){const s=await requireRole(["ADMIN","STAFF","CHEF"]);if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});return NextResponse.json(await prisma.order.findMany({include:{items:{include:{menuItem:true}}},orderBy:{createdAt:"desc"}}));}
export async function POST(req:Request){
 try{
 const body=await req.json();const name=String(body.customerName||"").trim();const items=Array.isArray(body.items)?body.items:[];
 if(!name||!items.length)return NextResponse.json({error:"Customer name and at least one item are required"},{status:400});
 const ids=items.map((x:any)=>String(x.menuItemId));const menu=await prisma.menuItem.findMany({where:{id:{in:ids},isAvailable:true}});
 const map=new Map(menu.map(m=>[m.id,m]));let total=0;
 const lines=items.map((x:any)=>{const item=map.get(String(x.menuItemId));const qty=Math.max(1,Math.min(50,Math.floor(Number(x.quantity)||1)));if(!item)throw new Error("One or more menu items are unavailable");total+=item.price*qty;return{menuItemId:item.id,quantity:qty,unitPrice:item.price};});
 const order=await prisma.order.create({data:{orderNo:"DD-"+Date.now().toString().slice(-8),customerName:name,customerEmail:body.customerEmail?String(body.customerEmail):null,orderType:body.orderType==="DINE_IN"?"DINE_IN":"TAKEAWAY",tableNo:body.tableNo?String(body.tableNo):null,notes:body.notes?String(body.notes):null,total,items:{create:lines}}});
 return NextResponse.json(order,{status:201});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Could not place order"},{status:400});}
}
