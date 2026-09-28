import type { Metadata, Viewport } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
import UserCursor from "@/components/user-cursor";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tortslink.com"),
  title: "Free Case Review | TortsLinks",
  description:
    "See if you may qualify for compensation. Free, confidential case review — takes about 2 minutes.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  icons: { icon: [{ url: "/TTA_2@4x.webp", type: "image/webp" }] },
  openGraph: {
    title: "Free Case Review | TortsLinks",
    description:
      "See if you may qualify for compensation. Free, confidential case review — takes about 2 minutes.",
    siteName: "TortsLinks",
    type: "website",
    images: [{ url: "/TTA_2@4x.webp" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${instrument.variable}`}>
      <body className="cursor-none bg-paper font-sans text-ink antialiased">
        <UserCursor />
        {children}
      </body>
    </html>
  );
}
