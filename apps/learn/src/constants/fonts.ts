import { Inter, Caveat } from "next/font/google";

export const heading = { variable: "--font-heading" } as const;

export const base = Inter({
    subsets: ["latin"],
    variable: "--font-base",
});

export const handwriting = Caveat({
    subsets: ["latin"],
    variable: "--font-handwriting",
    weight: ["400", "500", "600", "700"],
});
