import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryClientProvider from "./components/reactQueryClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Meal Planner",
  description: "Your personal AI-powered meal planning assistant",
};

const clerkAppearance = {
  variables: {
    colorPrimary: "rgb(139, 92, 246)",
    colorNeutral: "rgb(255, 255, 255)",
    colorBackground: "rgb(17, 24, 39)",
    colorInputBackground: "rgb(31, 41, 55)",
    colorAlphaShade: "rgb(17, 24, 39)",
    colorText: "rgb(255, 255, 255)",
    colorTextSecondary: "rgb(255, 255, 255)",
    colorTextOnPrimaryBackground: "rgb(255, 255, 255)",
    colorInputText: "rgb(255, 255, 255)",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
    colorSuccess: "rgb(34, 197, 94)",
    colorDanger: "rgb(239, 68, 68)",
    colorWarning: "rgb(234, 179, 8)",
    colorInputBorder: "rgb(75, 85, 99)",
    fontSmoothing: "antialiased",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900`}
      >
        <ClerkProvider appearance={clerkAppearance}>
          <ReactQueryClientProvider>
            <Navbar />
            <div>{children}</div>
          </ReactQueryClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
