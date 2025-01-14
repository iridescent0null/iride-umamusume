import connectDB from "@/app/db/connect";
import { HoFUmaModel, ParameterModel, PropertyModel, WhiteFactorModel } from "@/app/db/models";
import { HoFUma, HoFUmaWithoutId, HoFUmaWithoutIdProperty, Parameter, Property, WhiteFactor, WhiteFactorWithoutUma } from "@/app/db/type";
import { NextRequest, NextResponse } from "next/server";
import { codeProperty, PropertyCreation } from "../historic/route";
import { Types } from "mongoose";

interface HoFUmaCreationRequest {
    hof: HoFUmaWithoutIdProperty,
    property: PropertyCreation,
    white_factors: WhiteFactorWithoutUma[]
}

export async function POST(request: NextRequest) {
    // TODO use transaction to delete those automatically when something goes wrong
    let orphanParameter: Types.ObjectId | undefined = undefined;
    let orphanProperty: Types.ObjectId | undefined = undefined;
    let orphanHof: Types.ObjectId | undefined = undefined;

    try {
        const uma: HoFUmaCreationRequest = await request.json();

        if (!uma || !uma.hof || !uma.property || !uma.white_factors || !uma.hof.parameter) {
            return NextResponse.json({message: "invalid json"}, {status: 403});
        }
        connectDB();
        const parameter: Parameter = await ParameterModel.create(uma.hof.parameter);
        if (!parameter) {
            console.error("failed to create a parameter row to create a hof uma");
            console.warn(uma);
            return NextResponse.json({message: "failed to create a parameter"}, {status: 500});
        }
        console.log(`parameter created: ${parameter}`);
        orphanParameter = parameter._id;

        const property: Property = await PropertyModel.create(codeProperty(uma.property));
        if (!property) {
            console.error("failed to create a property row to create a hof uma");
            console.warn(uma);
            return NextResponse.json({
                    message: "failed to create a property", 
                    orphan_parameter: parameter._id
                }, 
                {status: 500}
            );
        }
        console.log(`property created: ${property._id}`);
        orphanProperty = property._id;

        const hoFUmaToCreate: HoFUmaWithoutId = {
            ...uma.hof,
            parameter: parameter._id,
            property: property._id
        };
        const hoFUmaCreated: HoFUma = await HoFUmaModel.create(hoFUmaToCreate);
        if (!hoFUmaCreated) {
            console.error("failed to create the hof uma");
            console.warn(uma);
            return NextResponse.json({
                    message: "failed to create the hof uma",
                    orphan_parameter: parameter._id,
                    orphan_pro: property._id
                },
                {status: 500}
            );
        }
        console.log(`hof created (not yet white factors): ${hoFUmaCreated._id}`);
        orphanHof = hoFUmaCreated._id;

        const factors: WhiteFactor[]  = await WhiteFactorModel.create(
            uma.white_factors.map(factor => {return {...factor, HoFUma: hoFUmaCreated._id}})
        );
        if (!factors) {
            console.error("failed to attach the white factors to the uma")
            console.warn(uma);
            return NextResponse.json({
                    message: "hof uma was created, but white factors failed to be given to her",
                    orphan_parameter: parameter._id,
                    orphan_pro: property._id,
                    orphan_hof: hoFUmaCreated._id
                }, 
                {status: 500}
            );
        }
        console.log(`white factors created for: ${hoFUmaCreated._id}`);
        console.log(`${factors.map(factor => factor._id)}`);

        return NextResponse.json({
            message:"success", 
            uma: hoFUmaCreated._id, 
            parameter: parameter._id, 
            property: property._id, 
            white_factors: factors
        });

    } catch (err) {
        // TODO delete the orphans it can do it safely
        console.error(err);
        return NextResponse.json({
                message: "failure", 
                orphan: {parameter: orphanParameter, property: orphanProperty, hof: orphanHof}
            },
            {status: 500}
        );
    }
}
