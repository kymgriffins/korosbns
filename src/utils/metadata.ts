import { Metadata } from "next";

export const generateMetadata = ({
    title = `${process.env.NEXT_PUBLIC_APP_NAME || "Budget Ndio Story"} | Home`,
    description = `Turning budget data into stories for young Kenyans.`,
    image = "/images/og-image.png",
    icons = [
        {
            rel: "apple-touch-icon",
            url: "/logo.svg"
        },
        {
            rel: "icon",
            url: "/logo.svg"
        },
    ],
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string | null;
    icons?: Metadata["icons"];
    noIndex?: boolean;
} = {}): Metadata => ({
    title,
    description,
    icons,
    ...(noIndex && { robots: { index: false, follow: false } }),
});
