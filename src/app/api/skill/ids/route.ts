import connectDB from "@/app/db/connect";
import { SkillModel } from "@/app/db/models";
import { NextResponse } from "next/server";
import { AllIdMessage } from "../../historic/all/route";

export async function GET() {
    try {
        connectDB();
        const allIds = await SkillModel.find();
        return NextResponse.json({message: "success", ids: allIds.map(obj=>obj._id)} as AllIdMessage);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failure"} as AllIdMessage, {status: 500});
    }
}