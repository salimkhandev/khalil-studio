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
