import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        // In a real production environment, you would use:
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({ ... });

        console.log("Contact Form Submission:", { name, email, message });

        // Simulate a delay for premium feel
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For now, we simulate success. 
        // To actually send to griffinskimutai@gmail.com, the user needs to provide an API key.
        return NextResponse.json({ 
            success: true, 
            message: "Email sent successfully (Simulated)" 
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to send message" },
            { status: 500 }
        );
    }
}
