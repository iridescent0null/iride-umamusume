import mongoose from "mongoose";

const Schema = mongoose.Schema;

// 0,1,2,3,4... (G is 7)
type Rank = "S" | "A" | "B" | "C" | "D" | "E" | "F" | "G";
const rankMap = new Map<Rank,number>();
rankMap.set("S",0);
rankMap.set("A",1);
rankMap.set("B",2);
rankMap.set("C",3);
rankMap.set("D",4);
rankMap.set("E",5);
rankMap.set("F",6);
rankMap.set("G",7);

/** e.g. E -> 5 */
function codeRank(rank: Rank) {
    return rankMap.get(rank);
}

/** e.g. 0 -> S (in Rank, which extends string) */
function decodeRank(rank: number) {
    return [...rankMap.entries()].find(entry=>entry[1] === rank)?.[0];
}

type Field = "turf" | "dirt";
type Distance = "sprint" | "mile" | "intermediate" | "long";
type Style = "lead" | "front" | "holdup" | "late";
type UmaPropertyKey = Field | Distance | Style;
const umaPropertyKeyMap = new Map<string,UmaPropertyKey>();
umaPropertyKeyMap.set("芝", "turf");
umaPropertyKeyMap.set("ダート", "dirt");
umaPropertyKeyMap.set("短距離", "sprint");
umaPropertyKeyMap.set("マイル", "mile");
umaPropertyKeyMap.set("中距離", "intermediate");
umaPropertyKeyMap.set("長距離", "long");
umaPropertyKeyMap.set("逃げ", "lead");
umaPropertyKeyMap.set("先行", "front");
umaPropertyKeyMap.set("差し", "holdup");
umaPropertyKeyMap.set("追込", "late");

/** e.g. 芝 => turf */
function codeUmaPropertyKey(plainName: string) {
    return umaPropertyKeyMap.get(plainName);
}

/** e.g. dirt => ダート, case sensitive */
function decodeUmaPropertyKey(key: UmaPropertyKey) {
    return [...umaPropertyKeyMap.entries()].find(entry => entry[1] === key)?.[0]
}
    
const HistoricUmaSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    name_en: {
        type: String,
        required: true
    },
    property: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "properties"
    },
    plain_id: {
        type: Schema.Types.ObjectId,
        ref: "historic_uma"
    }
});
HistoricUmaSchema.index(
    {name: 1},
    {unique: true}
);
HistoricUmaSchema.index(
    {property: 1},
    {unique: true}
);

const PropertySchema = new Schema({
    turf: {
        type: Number,
        required: true
    },
    dirt: {
        type: Number,
        required: true
    },
    sprint: {
        type: Number,
        required: true
    },
    mile: {
        type: Number,
        required: true
    },
    intermediate: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    lead: {
        type: Number,
        required: true
    },
    front: {
        type: Number,
        required: true
    },
    holdup: {
        type: Number,
        required: true
    },
    late: {
        type: Number,
        required: true
    }
});

// client mode requires the "?" mark (like models?.historic_umas) for some reason (next's bug?)
export const HistoricUmaModel = mongoose.models?.historic_umas || mongoose.model("historic_umas", HistoricUmaSchema);
export const PropertyModel = mongoose.models?.properties || mongoose.model("properties", PropertySchema);
export { codeRank, decodeRank, codeUmaPropertyKey, decodeUmaPropertyKey };
export type { Rank, UmaPropertyKey, Field, Distance, Style };