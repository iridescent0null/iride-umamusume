import connectDB from "@/app/db/connect";
import { ScenarioFactorNameModel } from "@/app/db/models";
import { NextResponse } from "next/server";
import { AllIdMessage } from "../../historic/all/route";

export async function GET() {
    try {
        connectDB();
        const allIds = await ScenarioFactorNameModel.find();
        return NextResponse.json({
            message: "success", 
            factors: allIds.map(factor => {return {name: factor.name, _id:factor._id}})
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed"} as AllIdMessage, {status: 500});
    }
}