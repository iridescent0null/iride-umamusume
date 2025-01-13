import { Types } from "mongoose";

type HistoricUma = HistoricUmaWithoutId & {
    _id: Types.ObjectId, 
}

interface HistoricUmaWithoutId {
    name: string,
    name_en:string,
    plain_id?: Types.ObjectId
    property: Property
}

interface Property {
    turf: number,
    dirt: number,
    sprint: number,
    mile: number,
    intermediate: number,
    long: number,
    lead: number,
    front: number,
    holdup: number,
    late: number
}

export type { HistoricUma, Property };