import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { InterviewProvider } from "@/context/InterviewContext";

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IntervU - AI Interview Preparation",
  description: "Prepare for your next interview with AI-powered mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rethinkSans.variable} antialiased`}
      >
        <InterviewProvider>
          {children}
        </InterviewProvider>
      </body>
    </html>
  );
}
