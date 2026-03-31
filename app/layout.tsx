import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Formed Design — Team Planner",
  description: "Team Target Planner for Formed Design studio",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23121212'/><text y='22' x='4' font-size='20'>🎯</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#121212] text-white antialiased bg-noise">
        <div className="relative z-[1] min-h-screen">{children}</div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(30, 30, 30, 0.95)",
              color: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(16px)",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "13px",
              padding: "12px 16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            },
            success: {
              iconTheme: { primary: "#00e5a0", secondary: "#121212" },
            },
            error: {
              iconTheme: { primary: "#ff4d6a", secondary: "#121212" },
            },
          }}
        />
      </body>
    </html>
  );
}
