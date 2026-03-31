"use client";

/* Replaces root layout when an error bubbles here — must include html + body */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#121212",
          color: "rgba(255,255,255,0.92)",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            padding: 32,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>App error</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
            {error.message || "Something went wrong loading the app."}
          </p>
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
      </body>
    </html>
  );
}
