import { NextResponse } from "next/server";
import { version } from "../../../../package.json";

interface VersionMessage {
    version: string
}

export async function GET() {
    return NextResponse.json({version: version} as VersionMessage);
}