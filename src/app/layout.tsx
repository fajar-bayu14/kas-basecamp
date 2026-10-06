import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { getIsAdmin } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KasMinggu - Aplikasi Pencatat Kas Mingguan Sederhana",
  description:
    "Aplikasi pencatatan dan rekapan kas mingguan cepat Rp 5.000 dengan visualisasi grafik pemasukan serta ekspor instan ke format CSV.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await getIsAdmin();

  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Navbar isAdmin={isAdmin} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-12">
          {children}
        </main>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
