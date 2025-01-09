import connectDB from "@/app/db/connect";
import { NextResponse } from "next/server";

interface ConnectionMessage {
    connected: boolean,
    message?: string
}

/**
 * To confirm wether it can connect to the DB
 * @returns 
 */
export async function GET() {
    try {
        connectDB();
        return NextResponse.json({connected: true} as ConnectionMessage);
    } catch (err) {
        return NextResponse.json({connected: false, message: "cannot connect to the DB!"} as ConnectionMessage);
    }
}