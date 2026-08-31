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
  title: "NABIZ AI Platform - Çok Eksenli Tensör & Anomali Karar Destek",
  description: "TEKNOFEST 2026 N-Sosyal İnovasyon Yarışması - Sadir Pehlivan Takımı (#990060) Çift Kanatlı Sosyal Yapay Zekâ ve Yeni Nesil AdTech Platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
