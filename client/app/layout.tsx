import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import StructuredData from "@/components/StructuredData";
import { portfolioData } from "@/data/portfolioData";
import { EXTERNAL_SCRIPTS } from "@/lib/constants";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://machavivek.vercel.app";

const { profile, about } = portfolioData;

const SEO_DESCRIPTION =
  `${profile.name} is an Associate Software Engineer based in Hyderabad, India, ` +
  `specializing in Full Stack Development (React, Next.js, Node.js, FastAPI), ` +
  `AI Engineering (RAG, LangChain, Vector Databases, MCP Servers), Mobile Apps (React Native), ` +
  `and DevOps (Docker, AWS, CI/CD). LeetCode Knight with 1900+ rating, ` +
  `Institute Rank 3 at KMIT, and 1000+ DSA problems solved.`;

const SEO_KEYWORDS = [
  // Identity
  "Macha Vivek",
  "Vivek Macha",
  "MachaVivek",
  // Role
  "Associate Software Engineer",
  "Software Engineer Hyderabad",
  "Full Stack Developer India",
  "Full Stack Engineer",
  "React Developer",
  "Next.js Developer",
  "Node.js Developer",
  "FastAPI Developer",
  // AI
  "AI Engineer",
  "RAG Engineer",
  "LangChain Developer",
  "Vector Database",
  "MCP Server",
  "LLM Engineer",
  // Mobile
  "React Native Developer",
  "Mobile App Developer",
  // DevOps
  "Docker",
  "AWS Developer",
  "DevOps Engineer",
  "CI/CD",
  "GitHub Actions",
  // Data / Backend
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Microservices",
  "System Design",
  // CP
  "LeetCode Knight",
  "Competitive Programmer",
  "Data Structures Algorithms",
  // Misc
  "Open Source Developer",
  "TypeScript",
  "Python Developer",
  "Portfolio",
  "Hyderabad",
  "Telangana India",
].join(", ");

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: `${profile.name} | Associate Software Engineer & Full Stack Developer`,
    template: `%s | ${profile.name}`,
  },

  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,

  authors: [{ name: profile.name, url: BASE_URL }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "profile",
    url: BASE_URL,
    siteName: `${profile.name} — Portfolio`,
    title: `${profile.name} | Associate Software Engineer & Full Stack Developer`,
    description: SEO_DESCRIPTION,
    locale: "en_US",
    firstName: "Vivek",
    lastName: "Macha",
    gender: "male",
    username: "MachaVivek",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${profile.name} — Associate Software Engineer | Full Stack, AI & Mobile Developer`,
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | Associate Software Engineer & Full Stack Developer`,
    description: SEO_DESCRIPTION,
    creator: "@MachaVivek",
    images: ["/opengraph-image"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/images/avatar.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/images/avatar.png", sizes: "180x180", type: "image/png" }],
  },

  manifest: "/manifest.webmanifest",

  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },

  other: {
    "google-site-verification": "",   // ← add your Search Console verification token here when ready
    "msvalidate.01": "",              // ← add Bing verification token here when ready
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e1e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Inline theme init script to prevent flash of unstyled content (FOUC)
const themeInitScript = `
(function() {
  try {
    var mode = localStorage.getItem('portfolio-theme-mode');
    if (mode === 'light' || mode === 'dark') {
      document.documentElement.setAttribute('data-theme', mode);
      document.documentElement.style.colorScheme = mode;
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    }
    var palette = {
      purple: { primary: '#8B5CF6', secondary: '#7C3AED', ct: '#ffffff', rgb: '139, 92, 246', g1: 'linear-gradient(to bottom right, #8b5cf6 0%, rgba(124, 58, 237, 0) 50%)', g2: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #a78bfa, #8b5cf6)', glow: 'rgba(139, 92, 246, 0.4)' },
      violet: { primary: '#8B5CF6', secondary: '#7C3AED', ct: '#ffffff', rgb: '139, 92, 246', g1: 'linear-gradient(to bottom right, #8b5cf6 0%, rgba(124, 58, 237, 0) 50%)', g2: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #a78bfa, #8b5cf6)', glow: 'rgba(139, 92, 246, 0.4)' },
      cyan: { primary: '#22D3EE', secondary: '#06B6D4', ct: '#0f172a', rgb: '34, 211, 238', g1: 'linear-gradient(to bottom right, #22d3ee 0%, rgba(6, 182, 212, 0) 50%)', g2: 'linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(6, 182, 212, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #22d3ee, #0ea5e9)', glow: 'rgba(34, 211, 238, 0.4)' },
      yellow: { primary: '#FFDB70', secondary: '#E5A93C', ct: '#111827', rgb: '255, 219, 112', g1: 'linear-gradient(to bottom right, #ffdb70 0%, rgba(255, 219, 112, 0) 50%)', g2: 'linear-gradient(135deg, rgba(255, 219, 112, 0.25) 0%, rgba(229, 169, 60, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #ffdb70, #ffa62b)', glow: 'rgba(255, 219, 112, 0.4)' },
      blue: { primary: '#3B82F6', secondary: '#2563EB', ct: '#ffffff', rgb: '59, 130, 246', g1: 'linear-gradient(to bottom right, #3b82f6 0%, rgba(37, 99, 235, 0) 50%)', g2: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #60a5fa, #3b82f6)', glow: 'rgba(59, 130, 246, 0.4)' },
      teal: { primary: '#5EEAD4', secondary: '#14B8A6', ct: '#0f172a', rgb: '94, 234, 212', g1: 'linear-gradient(to bottom right, #5eead4 0%, rgba(20, 184, 166, 0) 50%)', g2: 'linear-gradient(135deg, rgba(94, 234, 212, 0.25) 0%, rgba(20, 184, 166, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #5eead4, #14b8a6)', glow: 'rgba(94, 234, 212, 0.4)' },
      pink: { primary: '#EC4899', secondary: '#DB2777', ct: '#ffffff', rgb: '236, 72, 153', g1: 'linear-gradient(to bottom right, #ec4899 0%, rgba(219, 39, 119, 0) 50%)', g2: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(219, 39, 119, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #f472b6, #ec4899)', glow: 'rgba(236, 72, 153, 0.4)' },
      lime: { primary: '#A3E635', secondary: '#84CC16', ct: '#111827', rgb: '163, 230, 53', g1: 'linear-gradient(to bottom right, #a3e635 0%, rgba(132, 204, 22, 0) 50%)', g2: 'linear-gradient(135deg, rgba(163, 230, 53, 0.25) 0%, rgba(132, 204, 22, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #bef264, #a3e635)', glow: 'rgba(163, 230, 53, 0.4)' }
    };
    var accentId = localStorage.getItem('portfolio-accent-id') || 'purple';
    var c = palette[accentId] || palette.purple;
    var root = document.documentElement;
    root.style.setProperty('--accent-color', c.primary);
    root.style.setProperty('--accent-secondary', c.secondary);
    root.style.setProperty('--accent-contrast-text', c.ct);
    root.style.setProperty('--accent-rgb', c.rgb);
    root.style.setProperty('--accent-gradient-1', c.g1);
    root.style.setProperty('--accent-gradient-2', c.g2);
    root.style.setProperty('--accent-text-gradient', c.tg);
    root.style.setProperty('--accent-glow', c.glow);
    root.style.setProperty('--orange-yellow-crayola', c.primary);
    root.style.setProperty('--vegas-gold', c.secondary);
    root.style.setProperty('--text-gradient-yellow', c.tg);
    root.style.setProperty('--bg-gradient-yellow-1', c.g1);
    root.style.setProperty('--bg-gradient-yellow-2', c.g2);
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        {/* FOUC-prevention: must run before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Schema.org JSON-LD structured data */}
        <StructuredData />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ErrorBoundary>
          <ThemeProvider>{children}</ThemeProvider>
        </ErrorBoundary>

        <Script
          type="module"
          src={EXTERNAL_SCRIPTS.IONICONS_ESM}
          strategy="afterInteractive"
        />
        <Script
          noModule
          src={EXTERNAL_SCRIPTS.IONICONS_NOMODULE}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
