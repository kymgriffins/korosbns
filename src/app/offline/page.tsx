export default function OfflinePage() {
  return (
    <div className="p-8 text-center max-w-[480px] mx-auto">
      <h1 className="text-2xl mb-4">You&apos;re offline</h1>
      <p className="text-muted-foreground mb-6">
        Some content may still be available from cache. Connect to the internet to access the latest.
      </p>
      <a
        href="/programmes"
        className="inline-block px-6 py-3 bg-blue-600 text-white no-underline rounded-lg font-semibold"
      >
        Browse cached programmes
      </a>
    </div>
  );
}
