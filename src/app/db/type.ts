import { Types } from "mongoose";
import { UmaPropertyKey } from "./models";

type HistoricUma = HistoricUmaWithoutId & {
    _id: Types.ObjectId, 
};

interface HistoricUmaWithoutId {
    name: string,
    name_en:string,
    plain_id?: Types.ObjectId,
    property: PropertyWithoutId
}

type Property = PropertyWithoutId & {
    _id: Types.ObjectId
};

interface PropertyWithoutId {
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

type Parameter = ParameterWithoutId & {
    _id: Types.ObjectId 
};

interface ParameterWithoutId {
    speed: number,
    stamina: number,
    power: number,
    guts: number,
    wisdom: number
}

type WhiteFactor = WhiteFactorWithoutId & {
    _id: Types.ObjectId
};
type WhiteFactorWithoutId = WhiteFactorWithoutUma & {
    hofuma: Types.ObjectId
};
interface WhiteFactorWithoutUma {
    star: number,
    skill?: Types.ObjectId,
    race?: Types.ObjectId,
    scenario?: Types.ObjectId
}

type HoFUma = HoFUmaWithoutId & {
    _id: Types.ObjectId
};
type HoFUmaWithoutId = HoFUmaWithoutIdProperty & {
    property: Types.ObjectId
};

interface HoFUmaWithoutIdProperty {
    created: Date,
    historic: Types.ObjectId,
    parameter: Types.ObjectId,
    star: number,
    point: number,
    awakeningLevel: number,
    redStar: number,
    redKind: UmaPropertyKey,
    greenStar: number,
    blueStar: number,
    blueKind: UmaPropertyKey,
    father?: Types.ObjectId,
    mother?: Types.ObjectId,
    note?: String
}

export type { HoFUma, HistoricUma, PropertyWithoutId, HoFUmaWithoutIdProperty, Property, ParameterWithoutId, Parameter, WhiteFactorWithoutUma, WhiteFactor, HoFUmaWithoutId };