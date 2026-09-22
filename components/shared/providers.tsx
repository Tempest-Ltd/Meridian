"use client";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1b2e24",
            color: "#fbfaf7",
            border: "none",
            borderRadius: "12px",
          },
        }}
      />
    </>
  );
}