import { ThemeProvider } from "next-themes";
import { Inter as InterFont } from "next/font/google";
import './globals.css'
import { Toaster } from "@/components/ui/sonner";
import { PHProvider } from "./providers";
import PostHogWrapper from "./PostHogWrapper";
import TopLoader from "./Toploader";
import { SessionProvider } from "next-auth/react";

import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  // title: "Second Opinion - Your AI-Powered Legal Research Assistant",
  // description: "Discover efficient legal research with LawSpeak, your AI-powered assistant.",
};

const Inter = InterFont({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={Inter.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="500x500" href="/images/icon-1.png" />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <SessionProvider>
        <PHProvider>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
                <main className="h-full   overflow-y-auto custom-scrollbar">
                  <PostHogWrapper />
                  <TopLoader />
                  {children}
                </main>
              <Toaster />
            </ThemeProvider>
          </ReactQueryProvider>
        </PHProvider>
        </SessionProvider>
      </body>
    </html>
  );
}