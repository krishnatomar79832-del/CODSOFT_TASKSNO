import {NextResponse} from "next/server";
export async function POST(){const r=NextResponse.redirect(new URL("/login",process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"));r.cookies.set("dinedesk_session","",{httpOnly:true,path:"/",maxAge:0});return r;}
