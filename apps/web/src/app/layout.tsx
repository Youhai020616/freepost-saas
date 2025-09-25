import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Use system fonts for reliable deployment
const geistSans = {
  variable: "--font-geist-sans",
  className: "",
};

const geistMono = {
  variable: "--font-geist-mono",
  className: "",
};

export const metadata: Metadata = {
  title: "Freepost - Social Media Scheduling Made Simple",
  description: "Schedule and manage your social media posts across all platforms with Freepost. Streamline your social media presence with our powerful scheduling platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
