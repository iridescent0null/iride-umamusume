import connectDB, { extractIdFromURL } from "@/app/db/connect";
import { HistoricUmaModel, PropertyModel } from "@/app/db/models";
import { RouteModuleHandleContext } from "next/dist/server/route-modules/route-module";
import { NextResponse } from "next/server";
import { HistoricUma } from "@/app/db/type";

/** dummy object for historic uma with which an icon path can be determined */
interface Stranger {
    name: string,
    name_en: string,
    note?: string
}

const anshinzawa: Stranger = {
    name: "安心沢刺々美",
    name_en:"anshinzawasasami",
    note: "dummy object you get when there is no such Uma"
};

export async function GET(ignored: unknown, context: RouteModuleHandleContext){
    try {
        const idOrErrorMessage = await extractIdFromURL(context);
        if (!(typeof idOrErrorMessage === "string")) {
            return idOrErrorMessage;
        }

        connectDB();
        const item = await HistoricUmaModel.findById(idOrErrorMessage);

        if (!item) {
            return NextResponse.json(anshinzawa, {status: 404});
        }
        
        const property = await PropertyModel.findById(item.property);

        return NextResponse.json({...item._doc, property: property} as HistoricUma);

    } catch (err) {
        console.error(err);
        return NextResponse.json({massage: "failed"}, {status: 500});
    }
}

export type { Stranger };