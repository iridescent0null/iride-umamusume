import { Types } from "mongoose";
import { UmaParameterKey, UmaPropertyKey } from "./models";

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
    blueKind: UmaParameterKey,
    father?: Types.ObjectId,
    mother?: Types.ObjectId,
    note?: string
}

interface HoFUmaWithMaterializedParameterWithoutIdProperty {
    created: Date,
    historic: Types.ObjectId,
    parameter: ParameterWithoutId, // API requires actual numbers, not id
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

type Race = RaceWithoutId & {
    _id: Types.ObjectId
};
interface RaceWithoutId {
    // currently just for the factors, then the other information omitted...
    name: string
}

type Skill = SkillWithoutId & {
    _id: Types.ObjectId
};
interface SkillWithoutId {
    // currently just for the factors, then the other information omitted...
    name: string
}

/** scenario factor like メカ娘シナリオ・GUTS, with its id in the DB */
type Factor = FactorWithoutId & {
    _id: Types.ObjectId
};
/** scenario factor like メカ娘シナリオ・GUTS */
interface FactorWithoutId {
    name: string
}

export type { HoFUma, HistoricUma, PropertyWithoutId, HoFUmaWithoutIdProperty, HoFUmaWithMaterializedParameterWithoutIdProperty, Property, ParameterWithoutId, Parameter, WhiteFactorWithoutUma, WhiteFactor, HoFUmaWithoutId, Race, RaceWithoutId, Skill, Factor, FactorWithoutId };