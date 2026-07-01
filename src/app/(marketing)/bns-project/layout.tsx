import React from "react";
import { Footer } from "@/layouts/Footer";

export default function BNSProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
