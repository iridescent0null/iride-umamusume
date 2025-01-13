import { Skill, SkillWithoutId } from "@/app/component/skillRow";
import connectDB from "@/app/db/connect";
import { BackgroundColor, codeBackgroundColor, codeIconColor, IconColor, SkillModel } from "@/app/db/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface SkillCreationRequest {
    name: string,
    iconColor: IconColor,
    backgroundColor: BackgroundColor
    isTurf?: boolean,
    isDirt?: boolean,
    isSprint?: boolean,
    isMile?: boolean,
    isIntermediate?: boolean,
    isLong?: boolean,
    isLead?: boolean,
    isFront?: boolean,
    isHoldup?: boolean,
    isLate?: boolean,
    inherent?: Types.ObjectId,
    base?: Types.ObjectId
}

interface SkillCreationResponse {
    message: string,
    skill?: Skill
}

export async function POST(request: NextRequest) {
    try {
        const skill: SkillCreationRequest = await request.json();
        connectDB();
        const skillObject: SkillWithoutId = {
            name: skill.name,
            iconColor: codeIconColor(skill.iconColor)!,
            backgroundColor: codeBackgroundColor(skill.backgroundColor)!,
            isTurf: skill.isTurf,
            isDirt: skill.isDirt,
            isSprint: skill.isSprint,
            isMile: skill.isMile,
            isIntermediate: skill.isIntermediate,
            isLong: skill.isLong,
            isLead: skill.isLead,
            isFront: skill.isFront,
            isHoldup: skill.isHoldup,
            isLate: skill.isLate,
            inherent: skill.inherent,
            base: skill.base
        }
        const generatedSkill = await SkillModel.create(skillObject); // attempts to directly use a literal object created here, namey "as Skill", fail to enjoy the excess properties check! 
        return NextResponse.json({message: "succeeded", skill: generatedSkill} as SkillCreationResponse);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed"} as SkillCreationResponse, {status: 500});
    }
}