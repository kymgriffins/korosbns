export default function OfflinePage() {
  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>You&apos;re offline</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Some content may still be available from cache. Connect to the internet to access the latest.
      </p>
      <a
        href="/learn"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          background: "#0070f3",
          color: "#fff",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        Browse cached content
      </a>
    </div>
  );
}
