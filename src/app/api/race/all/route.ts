import connectDB from "@/app/db/connect";
import { RaceModel } from "@/app/db/models";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectDB();
        const allRaces = await RaceModel.find(); 
        return NextResponse.json({
            message:"success", 
            races: allRaces.map(race => {return {name: race.name, _id:race._id};}) // removing _v
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failure"}, {status: 500});
    }
}