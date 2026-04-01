"use client";

import { Toaster } from "react-hot-toast";

/**
 * Toasts must live in a client boundary. Importing Toaster directly in the root
 * server layout can throw during the RSC/SSR pipeline in production.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
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
    </>
  );
}
