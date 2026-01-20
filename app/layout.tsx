import { Saira } from "next/font/google";

import "./globals.css";

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
        <div className="px-4 w-full">{children}</div>
      </body>
    </html>
  );
}
