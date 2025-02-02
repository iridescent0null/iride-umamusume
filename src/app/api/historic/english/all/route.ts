import { NextResponse } from "next/server";
import connectDB from "@/app/db/connect";
import { HistoricUmaModel } from "@/app/db/models";

interface HistoricEntry {
    _id: string, // it's objectId, but json converts it to string
    name_en: string
}

export async function GET() {
    try {
        connectDB();
        const result:HistoricEntry[] = await HistoricUmaModel.find().select(["_id","name_en"]);
        return NextResponse.json({message:"success", result:result});
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed"}, {status: 500});
    }
}

export type {HistoricEntry};