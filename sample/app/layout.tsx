import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";

export const metadata: Metadata = {
  title: "vCard - Personal Portfolio",
  description: "Personal portfolio website - Richard Hanrick, Web Developer",
  icons: {
    icon: "/images/logo.ico",
  },
};

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
      yellow: { primary: '#FFDB70', secondary: '#E5A93C', ct: '#111827', rgb: '255, 219, 112', g1: 'linear-gradient(to bottom right, #ffdb70 0%, rgba(255, 219, 112, 0) 50%)', g2: 'linear-gradient(135deg, rgba(255, 219, 112, 0.25) 0%, rgba(229, 169, 60, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #ffdb70, #ffa62b)', glow: 'rgba(255, 219, 112, 0.4)' },
      cyan: { primary: '#22D3EE', secondary: '#06B6D4', ct: '#0f172a', rgb: '34, 211, 238', g1: 'linear-gradient(to bottom right, #22d3ee 0%, rgba(6, 182, 212, 0) 50%)', g2: 'linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(6, 182, 212, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #22d3ee, #0ea5e9)', glow: 'rgba(34, 211, 238, 0.4)' },
      violet: { primary: '#8B5CF6', secondary: '#7C3AED', ct: '#ffffff', rgb: '139, 92, 246', g1: 'linear-gradient(to bottom right, #8b5cf6 0%, rgba(124, 58, 237, 0) 50%)', g2: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #a78bfa, #8b5cf6)', glow: 'rgba(139, 92, 246, 0.4)' },
      blue: { primary: '#3B82F6', secondary: '#2563EB', ct: '#ffffff', rgb: '59, 130, 246', g1: 'linear-gradient(to bottom right, #3b82f6 0%, rgba(37, 99, 235, 0) 50%)', g2: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #60a5fa, #3b82f6)', glow: 'rgba(59, 130, 246, 0.4)' },
      teal: { primary: '#5EEAD4', secondary: '#14B8A6', ct: '#0f172a', rgb: '94, 234, 212', g1: 'linear-gradient(to bottom right, #5eead4 0%, rgba(20, 184, 166, 0) 50%)', g2: 'linear-gradient(135deg, rgba(94, 234, 212, 0.25) 0%, rgba(20, 184, 166, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #5eead4, #14b8a6)', glow: 'rgba(94, 234, 212, 0.4)' },
      pink: { primary: '#EC4899', secondary: '#DB2777', ct: '#ffffff', rgb: '236, 72, 153', g1: 'linear-gradient(to bottom right, #ec4899 0%, rgba(219, 39, 119, 0) 50%)', g2: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(219, 39, 119, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #f472b6, #ec4899)', glow: 'rgba(236, 72, 153, 0.4)' },
      lime: { primary: '#A3E635', secondary: '#84CC16', ct: '#111827', rgb: '163, 230, 53', g1: 'linear-gradient(to bottom right, #a3e635 0%, rgba(132, 204, 22, 0) 50%)', g2: 'linear-gradient(135deg, rgba(163, 230, 53, 0.25) 0%, rgba(132, 204, 22, 0) 60%), hsl(240, 2%, 13%)', tg: 'linear-gradient(to right, #bef264, #a3e635)', glow: 'rgba(163, 230, 53, 0.4)' }
    };
    var accentId = localStorage.getItem('portfolio-accent-id') || 'yellow';
    var c = palette[accentId] || palette.yellow;
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
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
        <ThemeProvider>{children}</ThemeProvider>

        {/* Ionicons */}
        <Script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
          strategy="afterInteractive"
        />
        <Script
          noModule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
