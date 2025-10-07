import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/lib/socket-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrustAuto - Pakistan's Trusted Car Marketplace",
  description: "Buy and sell cars with complete trust. Live auctions, AI-powered trade-in, and 200-point inspections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
