import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap', // Optimize font loading
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(DATA?.url || "https://tecportfolio.netlify.app/"),
  title: {
    default: DATA?.name || "Shivam Yadav",
    template: `%s | ${DATA?.name || "Shivam Yadav"}`,
  },
  description: DATA?.description || "Full-Stack Developer & MCA Graduate",
  keywords: [
    "Shivam Yadav",
    "Full-Stack Developer",
    "React",
    "Node.js",
    "Python",
    "Machine Learning",
    "Web Development",
    "Portfolio",
    "MCA Graduate",
    "Software Engineer"
  ],
  authors: [{ name: DATA?.name || "Shivam Yadav" }],
  creator: DATA?.name || "Shivam Yadav",
  publisher: DATA?.name || "Shivam Yadav",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: `${DATA?.name || "Shivam Yadav"}`,
    description: DATA?.description || "Full-Stack Developer & MCA Graduate",
    url: DATA?.url || "https://tecportfolio.netlify.app/",
    siteName: `${DATA?.name || "Shivam Yadav"}`,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/me.png',
        width: 1200,
        height: 630,
        alt: `${DATA?.name || "Shivam Yadav"} - Portfolio`,
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: `${DATA?.name || "Shivam Yadav"}`,
    description: DATA?.description || "Full-Stack Developer & MCA Graduate",
    images: ['/me.png'],
  },
  verification: {
    google: "",
    yandex: "",
  },
  alternates: {
    canonical: DATA?.url || "https://shivamyadav.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/me.png"
          as="image"
          type="image/png"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//drive.google.com" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6",
          fontSans.variable
        )}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <TooltipProvider delayDuration={300}>
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1">
                {children}
              </main>
              <Navbar />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
