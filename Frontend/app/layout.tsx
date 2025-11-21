import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// -------------------------
// SEO METADATA
// -------------------------
export const metadata: Metadata = {
  title: "AI PDF Search | RAG Engine",
  description:
    "Search, index, and analyze PDF files using a powerful retrieval-augmented generation (RAG) AI engine.",
  keywords: [
    "RAG",
    "PDF Search",
    "AI Search",
    "Document AI",
    "Next.js",
    "Vector Search",
  ],
  openGraph: {
    title: "AI PDF Search",
    description: "AI-powered PDF search using RAG.",
    url: "https://yourdomain.com",
    siteName: "AI PDF Search",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI PDF Search",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

// ----------------------------------
// ROOT LAYOUT
// ----------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#2ed573",
                color: "#fff",
                borderRadius: "8px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
