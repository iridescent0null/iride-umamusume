import connectDB from "@/app/db/connect";
import { RaceModel } from "@/app/db/models";
import { NextRequest, NextResponse } from "next/server";

interface RaceWithoutId {
    name: string
}

export async function POST(request: NextRequest) {
    try {
        const race: RaceWithoutId = await request.json();
        connectDB();
        const raceCreated = await RaceModel.create(race);
        if (!raceCreated) {
            return NextResponse.json({message: "failed to create the race"}, {status: 500});
        }
        console.log(`race created: ${raceCreated}`);
        return NextResponse.json({message: "success", race: raceCreated});
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed to create the race"}, {status: 500});
    }
}

// TODO implement get