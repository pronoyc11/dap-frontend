import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

export const metadata: Metadata = {
  title: {
    default: "Developer Assessment Platform",
    template: "%s | Developer Assessment Platform",
  },
  description: "A code-forward assessment and evaluation platform for modern engineering teams.",
  keywords: ["developer assessment", "technical hiring", "coding evaluation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
