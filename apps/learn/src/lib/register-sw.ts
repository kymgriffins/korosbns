export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        // registered
      })
      .catch(() => {
        // registration failed
      });
  });
}

export function unregisterServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (!navigator.serviceWorker) return;
  const promise = navigator.serviceWorker.ready;
  if (!promise || typeof promise.then !== "function") return;
  promise.then((r) => r.unregister()).catch(() => {});
}
