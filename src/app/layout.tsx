import type { Metadata } from "next";
import { Epilogue, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DevToolbar from "@/components/DevToolbar";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "900"],
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
  weight: ["400", "500", "600", "700"],
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
        <script
          dangerouslySetInnerHTML={{
            __html: `/* Add 'fonts-loaded' class when Material Symbols font is ready */(function(){try{if(typeof document==='undefined')return;var font='Material Symbols Outlined';if(document.fonts&&document.fonts.load){document.fonts.load('1em "'+font+'"').then(function(){document.documentElement.classList.add('fonts-loaded');}).catch(function(){/* ignore */});}else{window.addEventListener('load',function(){document.documentElement.classList.add('fonts-loaded');});}}catch(e){} })();`,
          }}
        />
      </head>
      <body
        className={`${epilogue.variable} ${manrope.variable} ${geistMono.variable} bg-surface font-body text-on-surface antialiased selection:bg-tertiary-fixed-dim selection:text-on-tertiary-fixed`}
      >
        <NavBar />
        {children}
        <Footer />
  {/* 21st.dev Toolbar - dev-only client component */}
  <DevToolbar />
      </body>
    </html>
  );
}
