"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./layout.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { DarkModeState } from "@/store/ProfileStore";
import { useInitialization } from "@/lib/InitializationHook";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // useInitialization();

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    DarkModeState.subscribe((message) => {
      setDarkMode(message);
    });
  }, []);

  return (
    <html lang="en">
      <body
        className={`${inter.className} ${
          darkMode ? "basicui-dark" : "basicui-light"
        }`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
