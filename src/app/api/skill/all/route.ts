import connectDB from "@/app/db/connect";
import { SkillModel } from "@/app/db/models";
import { Skill } from "@/app/db/type";
import { NextResponse } from "next/server";

interface AllSkillsResponse {
    message: string,
    skills?: Skill[]
}

export async function GET() {
    try {
        connectDB();
        const allIds = await SkillModel.find();
        return NextResponse.json({message: "success", skills: allIds.map(obj=>{return {_id: obj._id, name: obj.name}})} as AllSkillsResponse);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed"} as AllSkillsResponse, {status: 500});
    }
}

export type { AllSkillsResponse }