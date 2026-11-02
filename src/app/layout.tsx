import type { Metadata, Viewport } from "next";
import "./globals.css";

import { PWAProvider } from "@/components/pwa/PWAProvider";
import { ConnectionStatus } from "@/components/pwa/ConnectionStatus";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

export const viewport: Viewport = {
  themeColor: "#0D0B09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Arcadia — Premium Gaming Hub",
    template: "%s | Arcadia",
  },
  description: "Experience classical strategy and tactical arcade games on Arcadia. Compete on global leaderboards, earn prestige badges, and duel players worldwide in a cinematic Western gaming arena.",
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
    title: "Arcadia — Premium Gaming Hub",
    description: "Step into Arcadia's cinematic gaming client. Play classic titles, compete on global leaderboards, and unlock prestigious achievements.",
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--app-background)] text-[var(--text-primary)] font-sans antialiased flex flex-col selection:bg-[var(--accent-primary)]/30 selection:text-white">
        <PWAProvider>
          <ConnectionStatus />
          {children}
          <InstallPrompt />
        </PWAProvider>
      </body>
    </html>
  );
}
