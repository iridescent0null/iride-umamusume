import connectDB from "@/app/db/connect";
import { RaceModel } from "@/app/db/models";
import { Race } from "@/app/db/type";
import { NextResponse } from "next/server";

interface AllRacesResponse {
    message: string,
    races?: Race[]
}

export async function GET() {
    try {
        connectDB();
        const allRaces = await RaceModel.find(); 
        return NextResponse.json({
            message:"success", 
            races: allRaces.map(race => {return {name: race.name, _id:race._id};}) // removing _v
        } as AllRacesResponse);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failure"} as AllRacesResponse, {status: 500});
    }
}
export type { AllRacesResponse };