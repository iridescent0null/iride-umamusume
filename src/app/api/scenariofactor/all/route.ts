import connectDB from "@/app/db/connect";
import { ScenarioFactorNameModel } from "@/app/db/models";
import { NextResponse } from "next/server";
import { Factor } from "@/app/db/type";

interface AllScenarioFactorResponse {
    message: string,
    factors?:  Factor[]
}

export async function GET() {
    try {
        connectDB();
        const allIds = await ScenarioFactorNameModel.find();
        return NextResponse.json({
            message: "success", 
            factors: allIds.map(factor => {return {name: factor.name, _id:factor._id}})
        } as AllScenarioFactorResponse);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed"} as AllScenarioFactorResponse, {status: 500});
    }
}

export type { AllScenarioFactorResponse };