import connectDB, { extractIdFromURL } from "@/app/db/connect";
import { HoFUmaModel, ParameterModel, PropertyModel, UmaParameterKey, UmaPropertyKey, WhiteFactorModel } from "@/app/db/models";
import { HoFUma, ParameterWithoutId, PropertyWithoutId, WhiteFactor, WhiteFactorWithoutUma } from "@/app/db/type";
import { Types } from "mongoose";
import { RouteModuleHandleContext } from "next/dist/server/route-modules/route-module";
import { NextResponse } from "next/server";

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

export async function GET(ignored: unknown, context: RouteModuleHandleContext) {
    try {
        const idOrErrorMessage = await extractIdFromURL(context);
        if (!(typeof idOrErrorMessage === "string")) {
            return idOrErrorMessage;
        }
        connectDB();

        const wrappedUma: WrappedUma | null = await HoFUmaModel.findById(idOrErrorMessage);
        if (!wrappedUma) {
            return NextResponse.json({message: "the uma was not found"}, {status:404});
        }
        const hofUma = wrappedUma._doc;

        const wrappedParameter = await ParameterModel.findById(hofUma.parameter);
        const parameter: ParameterWithoutId = wrappedParameter?._doc;

        const wrappedProperty = await PropertyModel.findById(hofUma.property);
        const property: PropertyWithoutId = wrappedProperty?._doc;

        if (!parameter || !property) {
            return NextResponse.json(
                {message: "the uma was found, but her parameter and/or property was not found", uma:hofUma},
                {status: 500}
            );
        }

        const whiteFactors: WhiteFactor[] = await WhiteFactorModel.find(
            {
                HoFUma: hofUma._id
            }
        );

        // remove values which are not used in the client
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
        return NextResponse.json({message: "failure"}, {status:500});
    }
}

export type { HoFResponse, MaterializedHoFUma };