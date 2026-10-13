import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "GhostScout - Fold the search. Keep the resume.",
  description:
    "Search remote jobs, paste your resume, and score the match on an open model you can run yourself.",
  openGraph: {
    title: "GhostScout",
    description:
      "Search remote jobs and score your resume without sending it to a closed vendor.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("min-h-full antialiased", poppins.variable)}
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
