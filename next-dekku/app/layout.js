// app/layout.js
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/globals.css";
import localFont from "next/font/local";

export const metadata = {
  title: "Next Dekku",
  description: "A Next.js project",
};

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} min-h-screen flex flex-col font-pretendard`}
      >
        <Header />
        <main className="mt-20 flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
