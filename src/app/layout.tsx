import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bricks.zerorapid.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZeroLight Component Platform | Zerorapid",
    template: "%s | ZeroLight by Zerorapid",
  },
  description:
    "Token-driven B2B SaaS design system, 200+ production React UI components, and shadcn-compatible registry by Zerorapid.",
  keywords: [
    "Zerorapid",
    "ZeroLight",
    "SaaS Design System",
    "shadcn registry",
    "React UI components",
    "Design Tokens",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ZeroLight by Zerorapid",
    title: "ZeroLight Component Platform | Zerorapid",
    description:
      "200+ token-driven SaaS UI components, 6-tier atomic architecture, and shadcn-compatible registry built by Zerorapid.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZeroLight Component Platform | Zerorapid",
    description:
      "Install token-safe React SaaS UI components via npx zerolight and shadcn-compatible registry.",
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
