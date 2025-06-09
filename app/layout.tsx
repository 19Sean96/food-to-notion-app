import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "../components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "USDA Food Nutrition Data Aggregator with Notion Integration",
  description: "Search for foods to view nutrition information and save to Notion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 