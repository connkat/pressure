import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pressure",
  description: "Understand if the pressure change in YYC is causing your migraine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&f[]=pencerio&display=swap"
        precedence="default"
      />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
