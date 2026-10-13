import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Inter_Tight } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "GhostScout",
  description:
    "Match your resume to remote jobs with an open-weight model you can run yourself.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("dark min-h-full antialiased", inter.variable, interTight.variable)}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SmoothScroll>
          <Suspense fallback={null}>{children}</Suspense>
        </SmoothScroll>
        <Toaster />
      </body>
    </html>
  );
}
