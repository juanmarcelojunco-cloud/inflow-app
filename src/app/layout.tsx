import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "../styles/globals.css";
import PWAProvider from "@/components/PWAProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "inFlow",
  description: "Premium Financial Flow Manager",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased bg-background text-foreground`}>
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}
