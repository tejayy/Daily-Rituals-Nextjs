import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { HabitProvider } from "@/lib/context";
import { Navigation } from "@/components/navigation";

import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Growth System",
  description: "Track your habits and build good routines for personal growth",
  generator: "v0.app",

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],

    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <HabitProvider>
          <Navigation />

          <main className="pt-16">{children}</main>
        </HabitProvider>

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
