import Dashboard from "@/components/marketing/dashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from 'react'

const DashboardPage = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get("bns_admin_session")?.value;
    if (!session) {
        redirect("/admin/login");
    }

    return (
        <div className="w-screen h-screen">
            <Dashboard />
        </div>
    )
};

export default DashboardPage;

