import { Buffer } from "buffer";

// Ensure Buffer is available in the browser (Vite no longer polyfills Node globals)
if (typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = Buffer;
}