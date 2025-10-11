import BackgroundCanvas from "@/components/three/BackgroundCanvas";
import { TestimonialProvider } from "@/context/TestimonialContext";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-white text-black dark:bg-gradient-to-b dark:from-[#0b1020] dark:to-[#0e1326] dark:text-white">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bitcount+Single+Ink:wght@100..900&family=Nabla&family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <BackgroundCanvas />
          <TestimonialProvider>{children}</TestimonialProvider>
          <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
