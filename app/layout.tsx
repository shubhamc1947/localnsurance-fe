import type { Metadata } from "next";
import "@/index.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Localsurance - Global Health Insurance for Remote Teams",
  description: "Comprehensive health insurance coverage for distributed teams worldwide. Get affordable plans tailored to your remote workforce.",
  openGraph: {
    title: "Localsurance - Global Health Insurance for Remote Teams",
    description: "Comprehensive health insurance coverage for distributed teams worldwide.",
    url: "https://localnsurance.vercel.app/",
    siteName: "Localsurance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
