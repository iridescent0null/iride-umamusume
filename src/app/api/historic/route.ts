import connectDB from "@/app/db/connect";
import { codeRank, HistoricUmaModel, PropertyModel, Rank } from "@/app/db/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface HistoricCreationRequest {
    name: string,
    name_en: string,
    plain_id?: Types.ObjectId,
    property: PropertyCreation
}

interface PropertyCreation {
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

/**
 * change readble rank values to ones in number to insert the collection in DB
 * @param property having values like "S"
 * @returns property having values like 0
 */
function codeProperty(property: PropertyCreation) {
    return {
        turf: codeRank(property.turf),
        dirt: codeRank(property.dirt),
        sprint: codeRank(property.sprint),
        mile: codeRank(property.mile),
        intermediate: codeRank(property.intermediate),
        long: codeRank(property.long),
        lead: codeRank(property.lead),
        front: codeRank(property.front),
        holdup: codeRank(property.holdup),
        late: codeRank(property.late)
    };
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
        const propertyResult = await PropertyModel.create(codeProperty(uma.property));
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

export type { PropertyCreation };
export { codeProperty };