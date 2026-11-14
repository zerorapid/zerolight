import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroLight | SaaS Atom Studio",
  description: "Minimalist atomic UI components for rapid SaaS engineering.",
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
