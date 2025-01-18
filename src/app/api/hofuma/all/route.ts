import { Star } from "@/app/component/hof";
import connectDB from "@/app/db/connect";
import { HoFUmaModel, UmaParameterKey, UmaPropertyKey } from "@/app/db/models";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

/** for in-line expression */
interface HoFUmaSummary {
    _id: Types.ObjectId,
    created: string,
    historic: Types.ObjectId,
    redStar: Star,
    redKind: UmaPropertyKey,
    blueStar: Star,
    blueKind: UmaParameterKey,
    greenStar: Star,
    father?:  Types.ObjectId,
    mother?: Types.ObjectId
}

export async function GET() {
    try {
        connectDB();
        const allHofUmas: HoFUmaSummary[] = await HoFUmaModel.find().select(
                [
                    "_id",
                    "historic",
                    "created",
                    "redStar",
                    "redKind",
                    "blueStar",
                    "blueKind",
                    "greenStar",
                    "father",
                    "mother"
                ]);
        return NextResponse.json(allHofUmas);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failure"}, {status: 500});
    }
}

export type { HoFUmaSummary };