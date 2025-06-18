import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "../components/providers";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import Header from "@/components/Header";
import { SearchModal } from "@/components/SearchModal";
import { NotionSetupModal } from "@/components/NotionSetupModal";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Food Nutrition Data Aggregator | Professional Nutrition Management",
  description: "Professional nutrition data management with USDA FoodData Central integration and seamless Notion workflow",
  keywords: ["nutrition", "food data", "USDA", "notion", "health tracking"],
  authors: [{ name: "Food Nutrition Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-background">
            <div className="flex h-screen">
              <NavigationSidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                {children}
              </div>
            </div>
            <SearchModal />
            <NotionSetupModal />
          </div>
        </Providers>
      </body>
    </html>
  );
} 