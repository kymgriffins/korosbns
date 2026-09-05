import localFont from "next/font/local";

export const neueMontreal = localFont({
  src: "../../public/fonts/NeueMontreal.woff",
  variable: "--font-base",
  display: "swap",
});

export const base = neueMontreal;
export const heading = neueMontreal;


