import connectDB from "@/app/db/connect";
import { RaceModel, ScenarioFactorNameModel } from "@/app/db/models";
import { NextRequest, NextResponse } from "next/server";

interface SenarioFactorNameWithoutId {
    name: string
}

export async function POST(request: NextRequest) {
    try {
        const factor: SenarioFactorNameWithoutId = await request.json();
        connectDB();
        const factorCreated = await ScenarioFactorNameModel.create(factor);
        if (!factorCreated) {
            return NextResponse.json({message: "failed to create the race"}, {status: 500});
        }
        console.log(`factor name registered: ${factorCreated}`);
        return NextResponse.json({message: "success", factor: factorCreated});
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed to create the race"}, {status: 500});
    }
}