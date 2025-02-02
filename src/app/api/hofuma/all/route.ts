import { Star } from "@/app/component/hof";
import connectDB from "@/app/db/connect";
import { HistoricUmaModel, HoFUmaModel, UmaParameterKey, UmaPropertyKey } from "@/app/db/models";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { HistoricEntry } from "../../historic/english/all/route";

interface WrappedHoFUmaSummary {
    _doc: HoFUmaSummary
}

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
    point: number,
    father?:  Types.ObjectId,
    mother?: Types.ObjectId
    name_en: string
}

export async function GET() {
    try {
        connectDB();
        const allHofUmas: WrappedHoFUmaSummary[] = await HoFUmaModel.find().select(
                [
                    "_id",
                    "historic", // TODO remove
                    "created",
                    "redStar",
                    "redKind",
                    "blueStar",
                    "blueKind",
                    "greenStar",
                    "point",
                    "father",
                    "mother"
                ]);

            const result: HistoricEntry[] = await HistoricUmaModel.find().select(["_id","name_en"]);
            const umasWithEnglishName = allHofUmas.map(hof => {
                return  {
                    ...hof._doc,
                    __v: undefined,
                    name_en: result.find(entry=>entry._id.toString() === hof._doc.historic.toString())?.name_en
                }
            })
        return NextResponse.json(umasWithEnglishName);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failure"}, {status: 500});
    }
}

export type { HoFUmaSummary };