import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "American Dream Lawn Care",
  description: "Premium lawn care and landscaping services in Riverview, Florida. Experience the difference with our expert team.",
  keywords: ["Lawn Care", "Landscaping", "Riverview", "Florida", "Premium Service", "Gardening"],
  authors: [{ name: "American Dream Lawn Care" }],
  icons: {
    icon: "/favicon.ico", // Assuming standard favicon location, update if specific
  },
  openGraph: {
    title: "American Dream Lawn Care",
    description: "Premium lawn care and landscaping services in Riverview, Florida.",
    url: "https://americandreamlawn.com", // Placeholder URL
    siteName: "American Dream Lawn Care",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "American Dream Lawn Care",
    description: "Premium lawn care and landscaping services in Riverview, Florida.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
