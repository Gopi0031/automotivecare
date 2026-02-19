import { Inter } from "next/font/google";
import "./globals.css";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Automotive Car Care - Premium Car Care Services",
  description: "Professional automotive care and maintenance services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <TopBanner />
        <Header />
        {children} 
        <Footer />
      </body>
    </html>
  );
}
