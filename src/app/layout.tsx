import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroLight | Ephemeral Micro-Action Runtime Engine",
  description: "Proprietary, ephemeral design system and runtime engine tailored strictly for B2B SaaS micro-actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-rose-500/20 selection:text-rose-300">
        {children}
      </body>
    </html>
  );
}
