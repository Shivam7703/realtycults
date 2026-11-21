import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/component/header";
import Footer from "@/component/footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RealtyCults | Property & Real Estate Guidance in Delhi",
    template: "%s | RealtyCults",
  },
  description:
    "RealtyCults helps you find suitable property opportunities across Delhi and beyond—from residential plots and agricultural land to real estate investments.",
  keywords: [
    "RealtyCults",
    "real estate Delhi",
    "residential plots",
    "agricultural land",
    "property investment",
    "Lajpat Nagar Delhi",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}