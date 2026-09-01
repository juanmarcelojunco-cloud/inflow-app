"use client";
import { useEffect } from "react";

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('inFlow Service Worker registered'))
        .catch(err => console.error('SW registration failed:', err));
    }
  }, []);

  return <>{children}</>;
}
