import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroLight | SaaS Atom Studio",
  description: "Minimalist Apple and Airbnb style atomic UI components for rapid SaaS engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8F9FA] text-[#111111] antialiased selection:bg-neutral-200">
        {children}
      </body>
    </html>
  );
}
