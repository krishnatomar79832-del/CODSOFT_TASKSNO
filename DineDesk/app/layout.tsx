import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "DineDesk | Restaurant Platform", description: "Restaurant ordering and table management" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
