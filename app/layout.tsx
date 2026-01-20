import type { Metadata } from "next";
import { Saira } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Frontend for Redis cache and PostgreSQL database",
  description: "Ngee Ann Polytechnic Database Assignment prob",
};

const font = Saira({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <main className="px-4 w-full">{children}</main>
      </body>
    </html>
  );
}
