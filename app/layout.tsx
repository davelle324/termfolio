import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Davelle Carreiro",
  description: "Software engineer based in Boston, MA.",
  metadataBase: new URL("https://davelle.dev"),
  openGraph: {
    title: "Davelle Carreiro",
    description: "Software engineer based in Boston, MA.",
    url: "https://davelle.dev",
    siteName: "davelle.dev",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Davelle Carreiro",
    description: "Software engineer based in Boston, MA.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full`}>
      <body className="h-full font-[family-name:var(--font-mono)]">
          {children}
          <Analytics />
        </body>
    </html>
  );
}
