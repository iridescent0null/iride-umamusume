import connectDB, { extractIdFromURL, IdParameteContext } from "@/app/db/connect";
import { SkillModel } from "@/app/db/models";
import { NextResponse } from "next/server";

export async function GET(ignored: unknown, context: IdParameteContext) {
    try {
        const idOrErrorMessage = await extractIdFromURL(context);
        if (!(typeof idOrErrorMessage === "string")) {
            return idOrErrorMessage;
        }
        connectDB();
        const skill = await SkillModel.findById(idOrErrorMessage);

        if (!skill) {
            return NextResponse.json("", {status: 404});
        }

        return NextResponse.json(skill);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed"}, {status: 500});
    }
}