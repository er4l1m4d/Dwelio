import type { Metadata } from "next";
import { Epilogue, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dwelio | Find it. Trust it. Move in.",
    template: "%s | Dwelio",
  },
  description:
    "Nigeria's trust-first property marketplace for verified homes, direct landlord access, and secure digital renting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${epilogue.variable} ${manrope.variable} ${geistMono.variable} bg-surface font-body text-on-surface antialiased selection:bg-tertiary-fixed-dim selection:text-on-tertiary-fixed`}
      >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
