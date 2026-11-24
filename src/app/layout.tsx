import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ui.zerorapid.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZeroLight UI & Craft Studio | ZeroRapid",
    template: "%s | ZeroLight by ZeroRapid",
  },
  description:
    "Token-driven B2B SaaS design system, ZeroFlash brand deck generator, 33-rule ZeroAuditor AI-footprint scanner, and vector World Atlas studio by ZeroRapid (zerorapid.in).",
  keywords: [
    "ZeroRapid",
    "ZeroLight",
    "SaaS Design System",
    "shadcn registry",
    "ZeroAuditor",
    "ZeroFlash",
    "UIUX Agency India",
    "vibe coding agency",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ZeroLight by ZeroRapid",
    title: "ZeroLight UI & Craft Studio | ZeroRapid",
    description:
      "129+ token-driven UI components, 33-rule AI-slop UI auditor, brand token studio, and shadcn-compatible registry built by ZeroRapid.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZeroLight UI & Craft Studio | ZeroRapid",
    description:
      "Audit SaaS interfaces against 33 craft rules, generate brand decks, and install token-safe React UI via npx zerolight.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className="min-h-screen bg-[#F8FAFC] text-[#09090B] antialiased selection:bg-neutral-200">
        {children}
      </body>
    </html>
  );
}
