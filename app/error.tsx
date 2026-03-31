"use client";

import { useEffect } from "react";

/**
 * Keep this file dependency-free (no lucide, no app CSS imports) so Next can
 * always load the error boundary even when other chunks fail.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#121212",
        color: "rgba(255,255,255,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          padding: 32,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 32, marginBottom: 16 }} aria-hidden>
          ⚠️
        </p>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest ? (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
            Ref: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            borderRadius: 12,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #00b4ff, #0070cc)",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
