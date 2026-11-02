import type { Metadata, Viewport } from "next";
import "./globals.css";

import { PWAProvider } from "@/components/pwa/PWAProvider";
import { ConnectionStatus } from "@/components/pwa/ConnectionStatus";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

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
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
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
