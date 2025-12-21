import { Buffer } from "buffer";

// Ensure Buffer is available in the browser (Vite no longer polyfills Node globals)
if (typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = Buffer;
}

if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
}

if (typeof (window as any).process === "undefined") {
  (window as any).process = { env: {} };
}
