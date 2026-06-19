import { NextResponse } from "next/server";

export async function GET() {
    const fallbackImages = [
        {
            src: "/images/towwnhallmay/129A3912.jpg",
            alt: "Civic Deliberation Townhall",
            width: 800,
            height: 600,
        },
        {
            src: "/images/towwnhallmay/129A3863.jpg",
            alt: "Youth Engagement Spotlight",
            width: 800,
            height: 600,
        },
        {
            src: "/images/towwnhallmay/129A3923.jpg",
            alt: "Public Budget Presentation Assembly",
            width: 800,
            height: 600,
        },
        {
            src: "/images/towwnhallmay/129A4056.jpg",
            alt: "County Accountability Workshop",
            width: 800,
            height: 600,
        },
        {
            src: "/images/towwnhallmay/129A4094.jpg",
            alt: "Collective Consensus Gathering",
            width: 800,
            height: 600,
        }
    ];

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json({ images: fallbackImages, note: "Loaded local fallback images due to missing Cloudinary credentials" });
    }

    try {
        const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
        
        // Using Search API to get images from the folder "cohort i"
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${auth}`,
                },
                body: JSON.stringify({
                    expression: `folder:"cohort i"`,
                    max_results: 50,
                    sort_by: [{ created_at: "desc" }],
                }),
                cache: "no-store", // Ensure we get fresh data
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Cloudinary API error:", error);
            return NextResponse.json({ error: "Failed to fetch images from Cloudinary" }, { status: response.status });
        }

        const data = await response.json();
        
        const images = data.resources.map((resource: any) => ({
            src: resource.secure_url,
            alt: resource.public_id.split("/").pop() || "Cohort Image",
            width: resource.width,
            height: resource.height,
        }));

        return NextResponse.json({ images });
    } catch (error) {
        console.error("Error fetching images:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
