import connectDB from "@/app/db/connect";
import { codeRank, HistoricUmaModel, PropertyModel, Rank } from "@/app/db/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface HistoricCreationRequest {
    name: string,
    name_en: string,
    plain_id?: Types.ObjectId,
    property: { // these values must be Rank (= string, like "S"), not number like in the DB
        turf: Rank,
        dirt: Rank,
        sprint: Rank,
        mile: Rank,
        intermediate: Rank,
        long: Rank,
        lead: Rank,
        front: Rank,
        holdup: Rank,
        late: Rank        
    }
}

interface HistoricCreationResponse {
    message: string,
    uma?: HistoricUma
}

interface HistoricUma {
    _id: Types.ObjectId,
    name: string,
    name_en: string,
    plain_id?: Types.ObjectId,
    property: Types.ObjectId
}

export async function POST(request: NextRequest){
    try {
        const uma: HistoricCreationRequest = await request.json();
        connectDB();
        const propertyResult = await PropertyModel.create(
            {
                turf: codeRank(uma.property.turf),
                dirt: codeRank(uma.property.dirt),
                sprint: codeRank(uma.property.sprint),
                mile: codeRank(uma.property.mile),
                intermediate: codeRank(uma.property.intermediate),
                long: codeRank(uma.property.long),
                lead: codeRank(uma.property.lead),
                front: codeRank(uma.property.front),
                holdup: codeRank(uma.property.holdup),
                late: codeRank(uma.property.late)
            }
        )

        console.log(`property added into th DB: ${propertyResult}`);

        const historicResult: HistoricUma = await HistoricUmaModel.create(
            {
                name: uma.name,
                name_en: uma.name_en,
                plain_id: uma.plain_id,
                property: propertyResult._id
            }
        );
        console.log(`historic uma added into th DB: ${historicResult}`);
        return NextResponse.json({message: "succeeded", uma: historicResult} as HistoricCreationResponse);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed"} as HistoricCreationResponse, {status: 500});
    }
}