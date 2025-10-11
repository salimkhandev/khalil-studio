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
        {/* SEO Meta Tags */}
        <title>Khalil Studio - Expert Video Editor & Creative Professional</title>
        <meta name="description" content="Professional video editing services by Khalil Studio. Expert in motion graphics, 3D animation, and web experiences. Transform your vision into stunning visual content." />
        <meta name="keywords" content="video editor, motion graphics, 3D animation, video production, creative services, Khalil Studio, professional video editing" />
        <meta name="author" content="Khalil Studio" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Khalil Studio - Expert Video Editor & Creative Professional" />
        <meta property="og:description" content="Professional video editing services by Khalil Studio. Expert in motion graphics, 3D animation, and web experiences." />
        <meta property="og:image" content="/images/khalil.png" />
        <meta property="og:url" content="https://khalil-studio.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Khalil Studio" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Khalil Studio - Expert Video Editor & Creative Professional" />
        <meta name="twitter:description" content="Professional video editing services by Khalil Studio. Expert in motion graphics, 3D animation, and web experiences." />
        <meta name="twitter:image" content="/images/khalil.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/images/khalil.png" />
        <link rel="canonical" href="https://khalil-studio.vercel.app" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Khalil Studio" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/khalil.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/images/khalil.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/images/khalil.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/images/khalil.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/images/khalil.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/images/khalil.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/images/khalil.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/images/khalil.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/images/khalil.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/khalil.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/khalil.png" />
        <link rel="apple-touch-icon" href="/images/khalil.png" />
        <link rel="shortcut icon" href="/images/khalil.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bitcount+Single+Ink:wght@100..900&family=Nabla&family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <BackgroundCanvas />
          <TestimonialProvider>{children}</TestimonialProvider>
          <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
        </ThemeProvider>
        <script src="/install-prompt.js" defer></script>
      </body>
    </html>
  );
}
