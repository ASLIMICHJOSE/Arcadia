import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { PWAProvider } from "@/components/pwa/PWAProvider";
import { ConnectionStatus } from "@/components/pwa/ConnectionStatus";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#100F0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Arcadia — Premium Gaming Platform",
    template: "%s | Arcadia",
  },
  description: "Experience classical strategy and timeless arcade games on Arcadia. Compete on global leaderboards, earn gilded achievements, and challenge players worldwide.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Arcadia",
  },
  openGraph: {
    title: "Arcadia — Premium Gaming Platform",
    description: "Step into Arcadia's neoclassical gaming arena. Play classic titles, compete on global leaderboards, and unlock prestigious achievements.",
    siteName: "Arcadia",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased flex flex-col selection:bg-[var(--gold)]/30 selection:text-white">
        <PWAProvider>
          <ConnectionStatus />
          {children}
          <InstallPrompt />
        </PWAProvider>
      </body>
    </html>
  );
}
