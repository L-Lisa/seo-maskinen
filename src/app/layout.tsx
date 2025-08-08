import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEO Maskinen - Sveriges enklaste SEO-verktyg",
  description:
    "SEO-verktyg för småföretagare som vill förbättra sin hemsida själva",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-dark text-light min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
