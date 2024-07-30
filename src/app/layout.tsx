import type { Metadata } from "next";
import { Inter, Lato, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Inventory management system",
  description: "Inventory management system",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
    <html lang="en">
      <body className={lato.className}>
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
              {children}
              <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </body>
      </html>
      </ConvexClientProvider>
  );
}
