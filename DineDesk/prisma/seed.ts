import {PrismaClient,Role} from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma=new PrismaClient();
async function main(){
 const passwordHash=await bcrypt.hash("DineDesk@123",12);
 await prisma.user.upsert({where:{email:"admin@dinedesk.local"},update:{},create:{name:"DineDesk Admin",email:"admin@dinedesk.local",passwordHash,role:Role.ADMIN}});
 const dishes=[
  {category:"Starters",name:"Paneer Tikka",description:"Char-grilled paneer with peppers and spices",price:220},
  {category:"Starters",name:"Veg Spring Rolls",description:"Crispy rolls with seasonal vegetables",price:160},
  {category:"Main Course",name:"Paneer Butter Masala",description:"Paneer in a rich tomato and butter gravy",price:280},
  {category:"Main Course",name:"Dal Makhani",description:"Slow-cooked black lentils",price:240},
  {category:"Main Course",name:"Veg Biryani",description:"Fragrant basmati rice with vegetables",price:210},
  {category:"Beverages",name:"Fresh Lime Soda",description:"Refreshing lime soda",price:90},
  {category:"Desserts",name:"Gulab Jamun",description:"Warm milk dumplings in sugar syrup",price:100}
 ];
 for(const name of ["Starters","Main Course","Beverages","Desserts"]){
  const c=await prisma.menuCategory.upsert({where:{name},update:{},create:{name}});
  for(const d of dishes.filter(x=>x.category===name)){
   const exists=await prisma.menuItem.findFirst({where:{name:d.name,categoryId:c.id}});
   if(!exists)await prisma.menuItem.create({data:{name:d.name,description:d.description,price:d.price,categoryId:c.id}});
  }
 }
 for(let i=1;i<=12;i++)await prisma.restaurantTable.upsert({where:{tableNo:`T${i}`},update:{},create:{tableNo:`T${i}`,capacity:i<=4?2:4,location:"Main Hall"}});
 console.log("Admin login: admin@dinedesk.local / DineDesk@123");
}
main().finally(()=>prisma.$disconnect());
