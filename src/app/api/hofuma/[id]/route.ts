import connectDB, { extractIdFromURL, IdParameteContext } from "@/app/db/connect";
import { HoFUmaModel, ParameterModel, PropertyModel, UmaParameterKey, UmaPropertyKey, WhiteFactorModel } from "@/app/db/models";
import { HoFUma, ParameterWithoutId, PropertyWithoutId, WhiteFactor, WhiteFactorWithoutUma } from "@/app/db/type";
import { DeleteResult, Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface HoFResponse {
    uma: MaterializedHoFUma,
    whiteFactors: WhiteFactorWithoutUma[]
}

interface MaterializedHoFUma {
    _id: Types.ObjectId
    property: PropertyWithoutId
    created: string, // attempts to handle a date via JSON are troublesome, then use string instead
    historic: Types.ObjectId,
    parameter: ParameterWithoutId,
    star: number,
    point: number,
    awakeningLevel: number,
    redStar: number,
    redKind: UmaPropertyKey,
    greenStar: number,
    blueStar: number,
    blueKind: UmaParameterKey,
    father?: Types.ObjectId,
    mother?: Types.ObjectId,
    note?: string
}

interface WrappedUma {
    _doc: HoFUma
}

interface DeleteRequest {
    point: number, // to prevent inadvertent deletion, require the point of the uma who is to be deleted
    doActually?: boolean
}

interface Orphans {
    factors?: WhiteFactor[],
    property?: PropertyWithoutId,
    parameter?: ParameterWithoutId,
    hofUma?: HoFUma
}

export async function GET(ignored: unknown, context: IdParameteContext) {
    try {
        const idOrErrorMessage = await extractIdFromURL(context);
        if (!(typeof idOrErrorMessage === "string")) {
            return idOrErrorMessage;
        }
        connectDB();

        const wrappedUma: WrappedUma | null = await HoFUmaModel.findById(idOrErrorMessage);
        if (!wrappedUma) {
            return NextResponse.json({message: "the uma was not found"}, {status: 404});
        }
        const hofUma = wrappedUma._doc;

        const wrappedParameter = await ParameterModel.findById(hofUma.parameter);
        const parameter: ParameterWithoutId = wrappedParameter?._doc;

        const wrappedProperty = await PropertyModel.findById(hofUma.property);
        const property: PropertyWithoutId = wrappedProperty?._doc;

        if (!parameter || !property) {
            return NextResponse.json(
                {message: "the uma was found, but her parameter and/or property was not found", uma: hofUma},
                {status: 500}
            );
        }

        const whiteFactors: WhiteFactor[] = await WhiteFactorModel.find(
            {
                HoFUma: hofUma._id
            }
        );

        // remove values which are not used in the client side
        const pureParameter =  {
            ...parameter,
            _id: undefined,
            __v: undefined,
        };
        const pureProperty = {
            ...property,
            _id: undefined,
            __v: undefined,
        }; 
        const pureWhiteFactors: WhiteFactorWithoutUma[] = whiteFactors.map(factor => {
            return {star: factor.star, skill: factor.skill, scenario: factor.scenario, race: factor.race};
        });

        const uma: HoFResponse = {
            uma: {
                ...hofUma,
                created: hofUma.created.toString(),
                parameter: pureParameter,
                property: pureProperty,
            },
            whiteFactors: pureWhiteFactors
        }

        return NextResponse.json(uma);
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failure"}, {status: 500});
    }
}

const stringifyForLog = (result: DeleteResult, name: string) => {
    return `${name} deletion: ${result.acknowledged}, ${result.deletedCount}`;
}; 

export async function DELETE(request: NextRequest, context: IdParameteContext) {
    let orphans: Orphans = {}; // to log data which have been failed to be deleted in the DB
    try {
        const idOrErrorMessage = await extractIdFromURL(context);
        if (!(typeof idOrErrorMessage === "string")) {
            return idOrErrorMessage;
        }
        connectDB();

        const wrappedUma: WrappedUma | null = await HoFUmaModel.findById(idOrErrorMessage);
        if (!wrappedUma) {
            return NextResponse.json({message: "the uma was not found"}, {status: 404});
        }
        const hofUma = wrappedUma._doc;

        const wrappedParameter = await ParameterModel.findById(hofUma.parameter);
        const parameter: ParameterWithoutId = wrappedParameter?._doc;

        const wrappedProperty = await PropertyModel.findById(hofUma.property);
        const property: PropertyWithoutId = wrappedProperty?._doc;
        const whiteFactors: WhiteFactor[] = await WhiteFactorModel.find({HoFUma: hofUma._id});

        // initially the data all exist in this orphan object, and gets removed one by one if it gets normally deleted in the DB
        orphans = {
                factors: whiteFactors,
                property: property,
                parameter: parameter,
                hofUma: hofUma
        };
        console.warn("hof delete request was made:");
        console.log(orphans);
        
        const json: DeleteRequest = await request.json();

        if (!json.doActually) {
            return NextResponse.json(
                {
                    message: "your request was correct but caused no effects because it didn't say delete the hof in actuality. Check the following data retrieved then delete her after you convicted you are doing right thing",
                    hof: hofUma, 
                    parameter:parameter, 
                    white_factors: whiteFactors, 
                    property: property
                },
                {status: 202}
            );
        }

        if (hofUma.point !== json.point) {
            return NextResponse.json({message: "the point doesn't match! Double check if you are to delete the right hof."}, {status: 400});
        }

        // delete data and remove those from the orphan step by step
        const deletedFactors = await WhiteFactorModel.deleteMany({HoFUma: hofUma._id});
        console.warn(stringifyForLog(deletedFactors, "factors"));
        if (deletedFactors.deletedCount < 1) {
            console.warn("no factor was deleted. This may be caused by an unexpected error or an uma without any white factors.");
        }
        orphans.factors = undefined;

        const deletedProperty = await PropertyModel.deleteOne({_id: hofUma.property});
        console.warn(stringifyForLog(deletedProperty, "property"));
        if (deletedProperty.deletedCount < 1) {
            throw new Error("deletion failed!");
        }
        orphans.property = undefined;

        const deletedParameter = await ParameterModel.deleteOne({_id: hofUma.parameter});
        console.warn(stringifyForLog(deletedParameter,"parameter"));
        if (deletedParameter.deletedCount < 1) {
            throw new Error("deletion failed!");
        }
        orphans.parameter = undefined;

        const deletedHof = await HoFUmaModel.deleteOne({_id: idOrErrorMessage});
        console.warn(stringifyForLog(deletedHof,"uma"));
        if (deletedHof.deletedCount < 1) {
            throw new Error("deletion failed!");
        }

        return NextResponse.json({
                factors: deletedFactors,
                property: deletedProperty,
                parameter: deletedParameter,
                hofUma: deletedHof
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failure", orphans: orphans}, {status: 500});
    }
}

export type { HoFResponse, MaterializedHoFUma };