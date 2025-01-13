import connectDB, { extractIdFromURL } from "@/app/db/connect";
import { SkillModel } from "@/app/db/models";
import { RouteModuleHandleContext } from "next/dist/server/route-modules/route-module";
import { NextResponse } from "next/server";

export async function GET(ignored: unknown, context: RouteModuleHandleContext) {
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