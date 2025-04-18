import connectDB from "@/app/db/connect";
import { HistoricUmaModel } from "@/app/db/models";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

interface AllIdMessage {
    message: string,
    ids?: Types.ObjectId[] // undefined means error, not 0 hit
}

export async function GET() {
    try {
        connectDB();
        const allIds = await HistoricUmaModel.find().select("_id");
        return NextResponse.json({message: "success", ids: allIds.map(obj=>obj._id)} as AllIdMessage);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed"} as AllIdMessage, {status: 500});
    }
}

export type { AllIdMessage };