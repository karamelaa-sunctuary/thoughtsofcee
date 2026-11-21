import type { Metadata } from "next";
import { Manrope, Special_Elite, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const specialElite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-special-elite", display: "swap" });
const cormorant = Cormorant_Garamond({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-cormorant", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = { title: "Thoughts of Cee", description: "where feelings become words." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={manrope.variable + " " + specialElite.variable + " " + cormorant.variable + " " + inter.variable}>{children}</body></html>;
}
